/**
 * Qwen Cloud SDK Wrapper
 *
 * Provides typed helpers for:
 *  - Qwen-Max chat completions (reasoning + obituary writing)
 *  - Qwen-text-embedding-v3 (semantic memory embeddings)
 */

const QWEN_API_KEY = process.env.QWEN_API_KEY || '';
const QWEN_BASE_URL = process.env.QWEN_BASE_URL || 'https://dashscope-intl.aliyuncs.com/api/v1';
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen-max';
const QWEN_EMBEDDING_MODEL = process.env.QWEN_EMBEDDING_MODEL || 'text-embedding-v3';

interface QwenChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface QwenChatResponse {
  output: {
    text: string;
    finish_reason: string;
  };
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface QwenEmbeddingResponse {
  output: {
    embeddings: Array<{ embedding: number[] }>;
  };
  usage: {
    total_tokens: number;
  };
}

/**
 * Send a chat message to Qwen-Max and get a response.
 */
export async function qwenChat(
  userMessage: string,
  systemPrompt?: string
): Promise<string> {
  const messages: QwenChatMessage[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch(`${QWEN_BASE_URL}/services/aigc/text-generation/generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: QWEN_MODEL,
        input: { messages },
        parameters: {
          result_format: 'text',
          max_tokens: 2048,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as QwenChatResponse;
    return data.output.text;
  } catch (error) {
    console.error('[Qwen] Chat API error:', error);
    return '[MemBrain] I encountered an error processing your request.';
  }
}

/**
 * Generate a text embedding using Qwen-text-embedding-v3.
 * Returns a 1536-dimensional float array.
 */
export async function qwenEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(`${QWEN_BASE_URL}/services/embeddings/text-embedding/text-embedding`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: QWEN_EMBEDDING_MODEL,
        input: { texts: [text] },
        parameters: { text_type: 'document' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Qwen Embedding API error: ${response.status}`);
    }

    const data = (await response.json()) as QwenEmbeddingResponse;
    return data.output.embeddings[0].embedding;
  } catch (error) {
    console.error('[Qwen] Embedding API error:', error);
    return new Array(1536).fill(0); // fallback zero vector
  }
}
