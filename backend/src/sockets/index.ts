import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env';
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
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.on('connection', (socket) => {
    logger.debug(`Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.debug(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Broadcasts an event to every connected client. Used after a vote is
 * successfully recorded so the homepage, category pages, and leaderboards
 * update instantly without a page refresh (per TID Section 3 — Live Results).
 */
export function broadcast<T>(event: string, payload: T) {
  if (!io) {
    logger.warn(`Attempted to broadcast "${event}" before sockets were initialized`);
    return;
  }
  io.emit(event, payload);
}

export function getIO(): SocketIOServer | null {
  return io;
}
