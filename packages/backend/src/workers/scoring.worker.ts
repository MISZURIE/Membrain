/**
 * Scoring Worker — Nightly TID re-score job.
 *
 * Runs on a CRON schedule (default: "0 2 * * *" — 2 AM daily).
 * Re-computes TID scores for all active memories across all users
 * to ensure temporal decay is applied over time.
 */

// TODO: Uncomment and configure once BullMQ + Redis are fully wired
/*
import { Worker, Job, Queue } from 'bullmq';
import { MemoryService } from '../services/MemoryService';
import prisma from '../lib/prisma';
import { redisConnection } from '../lib/redis';

const scoringQueue = new Queue('scoring', { connection: redisConnection });

// Schedule nightly re-score
scoringQueue.add(
  'nightly-rescore',
  {},
  {
    repeat: { cron: process.env.NIGHTLY_RESCORE_CRON || '0 2 * * *' },
  }
);

const scoringWorker = new Worker(
  'scoring',
  async (job: Job) => {
    console.log(`[ScoringWorker] Starting nightly TID re-score...`);

    const users = await prisma.user.findMany({ include: { profile: true } });

    for (const user of users) {
      const profile = user.profile;
      if (!profile) continue;

      const weights = {
        alpha: profile.alphaWeight,
        beta: profile.betaWeight,
        gamma: profile.gammaWeight,
        delta: profile.deltaWeight,
        lambda: profile.lambdaDecay,
      };

      const memories = await prisma.memory.findMany({
        where: { userId: user.id, status: 'ACTIVE' },
      });

      for (const memory of memories) {
        const newScore = MemoryService.computeTID(
          memory.recencyScore,
          memory.lastAccessedAt,
          memory.goalScore,
          memory.noiseScore,
          weights
        );
        await MemoryService.updateScore(memory.id, newScore);
      }

      console.log(`[ScoringWorker] Re-scored ${memories.length} memories for user ${user.id}`);
    }

    console.log(`[ScoringWorker] Nightly re-score complete`);
  },
  { connection: redisConnection }
);

export { scoringQueue, scoringWorker };
*/

console.log('[ScoringWorker] Worker module loaded (inactive until Redis configured)');
export {};
