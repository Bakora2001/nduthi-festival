import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';

let io: SocketIOServer | null = null;

export const SOCKET_EVENTS = {
  VOTE_CAST: 'vote:cast',
  LEADERBOARD_UPDATE: 'leaderboard:update',
  CATEGORY_UPDATE: 'category:update',
  LIVE_STATS: 'stats:update',
} as const;

export function initSockets(server: HttpServer): SocketIOServer {
  io = new SocketIOServer(server, {
    cors: {
      origin: true, // Allow all origins (localhost & production Vercel)
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    logger.info(`[WebSocket] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Broadcasts an event to every connected client in real-time.
 */
export function broadcast<T>(event: string, payload: T) {
  if (!io) {
    logger.warn(`Attempted to broadcast "${event}" before sockets were initialized`);
    return;
  }
  logger.info(`[WebSocket Broadcast] Emitting "${event}" to all connected clients: ${JSON.stringify(payload)}`);
  io.emit(event, payload);
}

export function getIO(): SocketIOServer | null {
  return io;
}
