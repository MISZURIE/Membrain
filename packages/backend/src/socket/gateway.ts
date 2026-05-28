import { Server, Socket } from 'socket.io';

/**
 * Socket.IO Gateway — Real-time WebSocket event hub.
 *
 * Handles:
 *  - join_session / send_message (Client → Server)
 *  - message_reply / memory_updated / budget_update / checkpoint_ready (Server → Client)
 */
export function setupSocketGateway(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Client → Server: Join a session room
    socket.on('join_session', ({ sessionId }: { sessionId: string }) => {
      socket.join(sessionId);
      console.log(`[Socket] ${socket.id} joined session ${sessionId}`);
    });

    // Client → Server: Send a chat message
    socket.on('send_message', async ({ message, sessionId }: { message: string; sessionId: string }) => {
      console.log(`[Socket] Message from ${socket.id} in session ${sessionId}: ${message}`);

      // TODO: Process via AgentService and emit reply
      socket.to(sessionId).emit('message_reply', {
        reply: `[MemBrain] Echo: ${message}`,
        memories_used: [],
        tokens: 0,
      });
    });

    // Emit memory updates to session
    socket.on('subscribe_memory', ({ userId }: { userId: string }) => {
      socket.join(`memory:${userId}`);
      console.log(`[Socket] ${socket.id} subscribed to memory updates for user ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * Emit a memory update event to all clients in a user's memory room.
 */
export function emitMemoryUpdate(
  io: Server,
  userId: string,
  data: { node_id: string; new_score: number; action: string }
): void {
  io.to(`memory:${userId}`).emit('memory_updated', data);
}

/**
 * Emit a token budget update.
 */
export function emitBudgetUpdate(
  io: Server,
  sessionId: string,
  data: { used: number; remaining: number; percentage: number; eta: string | null }
): void {
  io.to(sessionId).emit('budget_update', data);
}

/**
 * Emit a checkpoint-ready notification.
 */
export function emitCheckpointReady(
  io: Server,
  userId: string,
  proposals: Array<{ memoryId: string; tidScore: number; reason: string; content: string }>
): void {
  io.to(`memory:${userId}`).emit('checkpoint_ready', { proposals });
}
