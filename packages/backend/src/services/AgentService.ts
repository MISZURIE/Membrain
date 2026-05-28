import { qwenChat } from '../lib/qwen';
import { MemoryService } from './MemoryService';
import prisma from '../lib/prisma';


/**
 * AgentService — Core conversational agent powered by Qwen-Max.
 *
 * Responsible for:
 *  - Processing user messages with context from active memories
 *  - Selecting relevant memories for injection into the prompt
 *  - Tracking token usage per session
 */
export class AgentService {

  /**
   * Process a user message within a session context.
   * Retrieves relevant memories, injects them into context, calls Qwen-Max.
   */
  static async chat(userId: string, message: string, sessionId: string) {
    // 1. Retrieve top-scoring active memories for context
    const { memories } = await MemoryService.getAllByUser(userId, 1, 10);

    // 2. Build context from memories
    const memoryContext = memories
      .map((m: any) => `[Memory ${m.id} | Score: ${m.tidScore.toFixed(2)}] ${m.content}`)
      .join('\n');

    // 3. Construct system prompt
    const systemPrompt = `You are MemBrain, an intelligent AI assistant with persistent memory.
You remember past conversations and can recall relevant context.
Below are your current active memories sorted by importance:

${memoryContext || '[No memories yet]'}

Use these memories when relevant to the conversation. Be helpful, accurate, and concise.`;

    // 4. Call Qwen-Max
    const reply = await qwenChat(message, systemPrompt);

    // 5. Record memory access for used memories
    for (const memory of memories) {
      await MemoryService.recordAccess(memory.id);
    }

    // 6. Estimate token count
    const tokenCount = Math.ceil((systemPrompt.length + message.length + reply.length) / 4);

    return {
      reply,
      memoryUsed: memories.map((m: any) => m.id),
      tokenCount,
    };
  }

  /** Get all sessions for a user */
  static async getSessions(userId: string) {
    const sessions = await prisma.memory.findMany({
      where: { userId },
      select: { sessionId: true },
      distinct: ['sessionId'],
    });
    return sessions.filter((s: any) => s.sessionId).map((s: any) => s.sessionId);
  }
}
