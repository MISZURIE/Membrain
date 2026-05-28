import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * useSocket — Custom hook for managing Socket.IO connection.
 * Handles join_session, send_message, and all server-pushed events.
 */
export function useSocket(sessionId: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('/', {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      socket.emit('join_session', { sessionId });
    });

    socket.on('message_reply', (data) => {
      console.log('[Socket] Reply:', data);
    });

    socket.on('memory_updated', (data) => {
      console.log('[Socket] Memory updated:', data);
    });

    socket.on('budget_update', (data) => {
      console.log('[Socket] Budget update:', data);
    });

    socket.on('checkpoint_ready', (data) => {
      console.log('[Socket] Checkpoint ready:', data);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId]);

  const sendMessage = useCallback((message: string) => {
    socketRef.current?.emit('send_message', { message, sessionId });
  }, [sessionId]);

  return { socket: socketRef.current, sendMessage };
}
