import prisma from '../lib/prisma';

/**
 * TokenBudgetService — Tracks and manages token budget across sessions.
 *
 * Responsible for:
 *  - Calculating current token usage
 *  - Projecting overflow ETA
 *  - Triggering context surgery at threshold
 */
export class TokenBudgetService {

  static MAX_TOKENS = parseInt(process.env.DEFAULT_MAX_TOKENS || '128000');
  static SURGERY_TRIGGER = parseFloat(process.env.CONTEXT_SURGERY_TRIGGER || '0.85');

  /** Get current token budget status for a user */
  static async getStatus(userId: string) {
    const result = await prisma.memory.aggregate({
      where: { userId, status: 'ACTIVE' },
      _sum: { contentTokens: true },
      _count: true,
    });

    const used = result._sum.contentTokens || 0;
    const remaining = TokenBudgetService.MAX_TOKENS - used;
    const percentage = used / TokenBudgetService.MAX_TOKENS;

    let health: 'green' | 'yellow' | 'red';
    if (percentage < 0.5) health = 'green';
    else if (percentage < 0.8) health = 'yellow';
    else health = 'red';

    return {
      used,
      remaining: Math.max(0, remaining),
      total: TokenBudgetService.MAX_TOKENS,
      percentage: Math.round(percentage * 100),
      health,
      memoryCount: result._count,
      surgeryRequired: percentage >= TokenBudgetService.SURGERY_TRIGGER,
    };
  }

  /** Check if context surgery should be triggered */
  static async shouldTriggerSurgery(userId: string): Promise<boolean> {
    const status = await TokenBudgetService.getStatus(userId);
    return status.surgeryRequired;
  }
}
