import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().min(1),
});

// POST /api/agent/chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = chatSchema.parse(req.body);

    // TODO: Integrate AgentService with Qwen-Max
    res.json({
      reply: `[MemBrain] Echo: ${message}`,
      memoryUsed: [],
      tokenCount: 0,
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

// GET /api/agent/sessions
router.get('/sessions', async (req: Request, res: Response) => {
  // TODO: Fetch sessions from database
  res.json({ sessions: [] });
});

// GET /api/agent/sessions/:sessionId/history
router.get('/sessions/:sessionId/history', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  // TODO: Fetch session history from database
  res.json({ sessionId, history: [] });
});

export default router;
