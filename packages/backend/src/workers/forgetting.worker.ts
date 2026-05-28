/**
 * Forgetting Worker — BullMQ worker for processing forgetting proposals.
 *
 * Listens on the 'forgetting' queue and processes approved memory deletions:
 *  1. Generate obituary via Qwen-Max
 *  2. Archive to cold storage (Alibaba OSS)
 *  3. Soft-delete the memory
 */

// TODO: Uncomment and configure once BullMQ + Redis are fully wired
/*
import { Worker, Job } from 'bullmq';
import { ForgettingService } from '../services/ForgettingService';
import { redisConnection } from '../lib/redis';

interface ForgettingJobData {
  memoryId: string;
  userId: string;
}

const forgettingWorker = new Worker<ForgettingJobData>(
  'forgetting',
  async (job: Job<ForgettingJobData>) => {
    console.log(`[ForgettingWorker] Processing job ${job.id} — Memory: ${job.data.memoryId}`);

    try {
      const result = await ForgettingService.processApprovedForgetting(job.data.memoryId);
      console.log(`[ForgettingWorker] Successfully deleted memory ${job.data.memoryId}`);
      return result;
    } catch (error) {
      console.error(`[ForgettingWorker] Failed to process memory ${job.data.memoryId}:`, error);
      throw error;
    }
  },
  { connection: redisConnection }
);

forgettingWorker.on('completed', (job) => {
  console.log(`[ForgettingWorker] Job ${job.id} completed`);
});

forgettingWorker.on('failed', (job, err) => {
  console.error(`[ForgettingWorker] Job ${job?.id} failed:`, err.message);
});

export default forgettingWorker;
*/

console.log('[ForgettingWorker] Worker module loaded (inactive until Redis configured)');
export {};
