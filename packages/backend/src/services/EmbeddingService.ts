import { qwenEmbedding } from '../lib/qwen';

/**
 * EmbeddingService — Generates and manages vector embeddings via Qwen.
 *
 * Uses Qwen-text-embedding-v3 to create 1536-dim vectors
 * for semantic similarity search via pgvector.
 */
export class EmbeddingService {

  /**
   * Generate an embedding vector for a given text using Qwen.
   * Returns a 1536-dimensional float array.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    return qwenEmbedding(text);
  }

  /**
   * Compute cosine similarity between two vectors.
   * Used for G(M) — goal-relevance scoring in the TID formula.
   */
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) throw new Error('Vector dimension mismatch');

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }

  /**
   * Compute goal-relevance score G(M) for a memory against a task embedding.
   * Returns a value between 0 and 1.
   */
  static async computeGoalRelevance(
    memoryText: string,
    taskText: string
  ): Promise<number> {
    const [memoryEmb, taskEmb] = await Promise.all([
      EmbeddingService.generateEmbedding(memoryText),
      EmbeddingService.generateEmbedding(taskText),
    ]);

    // Cosine similarity is [-1, 1], normalize to [0, 1]
    const similarity = EmbeddingService.cosineSimilarity(memoryEmb, taskEmb);
    return (similarity + 1) / 2;
  }
}
