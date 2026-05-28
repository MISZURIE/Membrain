import prisma from '../lib/prisma';
import { MemoryService } from './MemoryService';
import { EmbeddingService } from './EmbeddingService';
import { qwenChat } from '../lib/qwen';


/**
 * ForgettingService — Manages the forgetting queue and obituary generation.
 *
 * Responsible for:
 *  - Scanning for forgetting candidates
 *  - Generating Memory Obituaries via Qwen-Max
 *  - Archiving obituaries to cold storage
 *  - Processing approved forgetting proposals
 */
export class ForgettingService {

  /**
   * Scan all active memories and identify forgetting candidates.
   * Returns memories below the user's configured forgetThreshold.
   */
  static async scanForCandidates(userId: string) {
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    const threshold = profile?.forgetThreshold ?? 0.15;
    return MemoryService.getForgettingCandidates(userId, threshold);
  }

  /**
   * Generate a Memory Obituary — a 1-sentence Qwen-Max summary of a memory
   * before permanent deletion.
   */
  static async generateObituary(memoryId: string, content: string, contentTokens: number) {
    const prompt = `You are a memory archivist. Summarize the following memory in exactly one concise sentence that captures the essential information. Be factual and precise.

Memory content:
"${content}"

One-sentence summary:`;

    const summary = await qwenChat(prompt);
    const summaryTokens = Math.ceil(summary.length / 4); // rough estimate
    const compressionRatio = contentTokens / summaryTokens;

    return prisma.memoryObituary.create({
      data: {
        memoryId,
        summary,
        originalTokens: contentTokens,
        summaryTokens,
        compressionRatio,
        ossKey: `obituaries/${memoryId}.json`, // TODO: Upload to Alibaba OSS
      },
    });
  }

  /**
   * Process an approved forgetting proposal:
   * 1. Generate obituary
   * 2. Archive to cold storage
   * 3. Soft-delete the memory
   */
  static async processApprovedForgetting(memoryId: string) {
    const memory = await MemoryService.getById(memoryId);
    if (!memory) throw new Error(`Memory ${memoryId} not found`);

    // Generate obituary before deletion
    await ForgettingService.generateObituary(
      memoryId,
      memory.content,
      memory.contentTokens
    );

    // Soft-delete
    await MemoryService.softDelete(memoryId);

    return { deleted: true, memoryId };
  }

  /** Get all obituaries for a user */
  static async getObituaries(userId: string) {
    return prisma.memoryObituary.findMany({
      where: { memory: { userId } },
      orderBy: { deletedAt: 'desc' },
    });
  }
}
