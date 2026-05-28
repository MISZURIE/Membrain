import prisma from '../lib/prisma';

/**
 * CheckpointService — Manages the Human-in-the-Loop (HITL) forgetting checkpoint flow.
 *
 * Responsible for:
 *  - Creating forgetting checkpoints with proposals
 *  - Processing user approval/rejection decisions
 *  - Auto-expiring checkpoints after timeout
 */
export class CheckpointService {

  /** Create a new forgetting checkpoint with proposals */
  static async createCheckpoint(
    userId: string,
    proposals: Array<{ memoryId: string; tidScore: number; reason: string }>
  ) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h default

    return prisma.forgettingCheckpoint.create({
      data: {
        userId,
        expiresAt,
        proposals: {
          create: proposals.map((p) => ({
            memoryId: p.memoryId,
            tidScore: p.tidScore,
            reason: p.reason,
          })),
        },
      },
      include: { proposals: true },
    });
  }

  /** Get all pending checkpoints for a user */
  static async getPending(userId: string) {
    return prisma.forgettingCheckpoint.findMany({
      where: { userId, status: 'PENDING' },
      include: { proposals: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Approve a single proposal within a checkpoint */
  static async approveProposal(proposalId: string) {
    return prisma.forgettingProposal.update({
      where: { id: proposalId },
      data: { approved: true, decidedAt: new Date() },
    });
  }

  /** Reject a single proposal */
  static async rejectProposal(proposalId: string) {
    return prisma.forgettingProposal.update({
      where: { id: proposalId },
      data: { approved: false, decidedAt: new Date() },
    });
  }

  /** Approve entire checkpoint */
  static async approveCheckpoint(checkpointId: string) {
    await prisma.forgettingProposal.updateMany({
      where: { checkpointId, approved: null },
      data: { approved: true, decidedAt: new Date() },
    });

    return prisma.forgettingCheckpoint.update({
      where: { id: checkpointId },
      data: { status: 'APPROVED', resolvedAt: new Date() },
    });
  }

  /** Reject entire checkpoint */
  static async rejectCheckpoint(checkpointId: string) {
    await prisma.forgettingProposal.updateMany({
      where: { checkpointId, approved: null },
      data: { approved: false, decidedAt: new Date() },
    });

    return prisma.forgettingCheckpoint.update({
      where: { id: checkpointId },
      data: { status: 'REJECTED', resolvedAt: new Date() },
    });
  }

  /** Expire stale checkpoints (called by cron) */
  static async expireStaleCheckpoints() {
    return prisma.forgettingCheckpoint.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED', resolvedAt: new Date() },
    });
  }
}
