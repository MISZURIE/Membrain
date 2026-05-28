import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    // TODO: Hash password, create user in DB, return JWT
    res.status(201).json({
      message: 'User registered successfully',
      token: 'placeholder-jwt-token',
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid registration data' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    // TODO: Verify credentials, return JWT
    res.json({
      message: 'Login successful',
      token: 'placeholder-jwt-token',
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid login data' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  // TODO: Refresh JWT token
  res.json({ token: 'placeholder-refreshed-jwt-token' });
});

export default router;
