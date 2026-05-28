import prisma from '../lib/prisma';

/**
 * MemoryService — CRUD operations + TID scoring for memory nodes.
 *
 * Responsible for:
 *  - Creating, reading, updating, and deleting memories
 *  - Computing the Temporal Importance Decay (TID) score: I(M,t)
 *  - Identifying forgetting candidates (score < threshold)
 */
export class MemoryService {

  /**
   * Compute TID importance score for a memory:
   * I(M, t) = α·R(M) + β·e^(-λ(t - t_last)) + γ·G(M) - δ·N(M)
   */
  static computeTID(
    recencyScore: number,
    lastAccessedAt: Date,
    goalScore: number,
    noiseScore: number,
    weights: { alpha: number; beta: number; gamma: number; delta: number; lambda: number }
  ): number {
    const now = Date.now();
    const deltaT = (now - lastAccessedAt.getTime()) / (1000 * 60 * 60 * 24); // days
    const temporalDecay = Math.exp(-weights.lambda * deltaT);

    const score =
      weights.alpha * recencyScore +
      weights.beta * temporalDecay +
      weights.gamma * goalScore -
      weights.delta * noiseScore;

    return Math.max(0, Math.min(1, score)); // clamp to [0, 1]
  }

  /** Create a new memory node */
  static async create(userId: string, content: string, contentTokens: number, sessionId?: string) {
    return prisma.memory.create({
      data: {
        userId,
        content,
        contentTokens,
        sessionId,
        // embedding will be set via EmbeddingService
      },
    });
  }

  /** Get all active memories for a user */
  static async getAllByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [memories, total] = await Promise.all([
      prisma.memory.findMany({
        where: { userId, status: 'ACTIVE' },
        orderBy: { tidScore: 'desc' },
        skip,
        take: limit,
      }),
      prisma.memory.count({ where: { userId, status: 'ACTIVE' } }),
    ]);
    return { memories, total, page, limit };
  }

  /** Get a single memory by ID */
  static async getById(id: string) {
    return prisma.memory.findUnique({
      where: { id },
      include: { obituary: true },
    });
  }

  /** Update a memory's TID score */
  static async updateScore(id: string, tidScore: number) {
    return prisma.memory.update({
      where: { id },
      data: { tidScore, updatedAt: new Date() },
    });
  }

  /** Mark memory access (bump recency) */
  static async recordAccess(id: string) {
    return prisma.memory.update({
      where: { id },
      data: {
        accessCount: { increment: 1 },
        lastAccessedAt: new Date(),
        recencyScore: 1.0, // reset recency on access
      },
    });
  }

  /** Get forgetting candidates below threshold */
  static async getForgettingCandidates(userId: string, threshold: number) {
    return prisma.memory.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        tidScore: { lt: threshold },
      },
      orderBy: { tidScore: 'asc' },
    });
  }

  /** Mark memory as pending deletion */
  static async markPendingDeletion(id: string) {
    return prisma.memory.update({
      where: { id },
      data: { status: 'PENDING_DELETION' },
    });
  }

  /** Soft-delete a memory */
  static async softDelete(id: string) {
    return prisma.memory.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }

  /** Get aggregate stats for a user */
  static async getStats(userId: string) {
    const [active, deleted, totalTokens, avgScore] = await Promise.all([
      prisma.memory.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.memory.count({ where: { userId, status: 'DELETED' } }),
      prisma.memory.aggregate({
        where: { userId, status: 'ACTIVE' },
        _sum: { contentTokens: true },
      }),
      prisma.memory.aggregate({
        where: { userId, status: 'ACTIVE' },
        _avg: { tidScore: true },
      }),
    ]);

    return {
      totalMemories: active + deleted,
      activeMemories: active,
      deletedMemories: deleted,
      totalTokens: totalTokens._sum.contentTokens || 0,
      avgTidScore: avgScore._avg.tidScore || 0,
    };
  }
}
