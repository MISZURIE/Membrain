import { createClient } from 'redis';

/**
 * Redis Client Singleton
 * Used for: session cache, token budget tracking, active context window, BullMQ.
 */

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => {
  console.error('[Redis] Connection error:', err);
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

// Export the connection config for BullMQ workers
export const redisConnection = {
  host: new URL(REDIS_URL).hostname,
  port: parseInt(new URL(REDIS_URL).port || '6379'),
};

export default redisClient;
