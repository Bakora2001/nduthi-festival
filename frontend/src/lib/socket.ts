import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const SOCKET_EVENTS = {
  VOTE_CAST: 'vote:cast',
  LEADERBOARD_UPDATE: 'leaderboard:update',
  CATEGORY_UPDATE: 'category:update',
  LIVE_STATS: 'stats:update',
} as const;

/**
 * Lazily connects to the backend Socket.IO server. Call this once (e.g. in a
 * top-level layout effect) and subscribe to SOCKET_EVENTS.VOTE_CAST to update
 * leaderboards/vote counts live, matching the TID's WebSocket requirement.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io('/', { path: '/socket.io', autoConnect: true });
  }
  return socket;
}
