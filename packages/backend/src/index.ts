import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import agentRoutes from './routes/agent.routes';
import memoryRoutes from './routes/memory.routes';
import checkpointRoutes from './routes/checkpoint.routes';
import authRoutes from './routes/auth.routes';
import { setupSocketGateway } from './socket/gateway';
import { rateLimitMiddleware } from './middleware/rateLimit.middleware';

dotenv.config({ path: '../../.env' });

const app = express();
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimitMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/checkpoint', checkpointRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'membrain-backend', timestamp: new Date().toISOString() });
});

// Socket.IO gateway
setupSocketGateway(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 MemBrain Backend running on http://localhost:${PORT}`);
});
