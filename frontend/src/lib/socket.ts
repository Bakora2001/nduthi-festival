import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const SOCKET_EVENTS = {
  VOTE_CAST: 'vote:cast',
  LEADERBOARD_UPDATE: 'leaderboard:update',
  CATEGORY_UPDATE: 'category:update',
  LIVE_STATS: 'stats:update',
} as const;

/**
 * Lazily connects to the backend Socket.IO server.
 * In production, VITE_API_URL points to the Render backend (e.g. https://nduthi-festival-backend.onrender.com).
 * Locally, it connects to '/' which Vite proxy handles.
 */
export function getSocket(): Socket {
  if (!socket) {
    const serverUrl = import.meta.env.VITE_API_URL || '/';
    socket = io(serverUrl, { path: '/socket.io', autoConnect: true });
  }
  return socket;
}
