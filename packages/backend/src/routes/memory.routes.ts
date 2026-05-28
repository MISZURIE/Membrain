import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const searchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().positive().default(10),
});

// GET /api/memory — List all memories (paginated)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  // TODO: Fetch from MemoryService
  res.json({ memories: [], page, limit, total: 0 });
});

// GET /api/memory/obituaries — List all obituaries
router.get('/obituaries', async (req: Request, res: Response) => {
  // TODO: Fetch from ObitService
  res.json({ obituaries: [] });
});

// GET /api/memory/stats — Token usage, node count, avg score
router.get('/stats', async (req: Request, res: Response) => {
  // TODO: Aggregate stats from MemoryService
  res.json({
    totalMemories: 0,
    activeMemories: 0,
    deletedMemories: 0,
    totalTokens: 0,
    avgTidScore: 0,
  });
});

// GET /api/memory/:id — Get memory + TID score breakdown
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: Fetch single memory with score breakdown
  res.json({ id, memory: null });
});

// POST /api/memory/search — Semantic search
router.post('/search', async (req: Request, res: Response) => {
  try {
    const { query, limit } = searchSchema.parse(req.body);
    // TODO: pgvector semantic search via EmbeddingService
    res.json({ results: [], query, limit });
  } catch (error) {
    res.status(400).json({ error: 'Invalid search request' });
  }
});

// DELETE /api/memory/:id — Manual delete
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: Delete via MemoryService + create obituary
  res.json({ deleted: true, id });
});

export default router;
