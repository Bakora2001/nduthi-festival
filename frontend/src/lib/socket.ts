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
 */
export function getSocket(): Socket {
  if (!socket) {
    const serverUrl = import.meta.env.VITE_API_URL || window.location.origin;
    socket = io(serverUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('[WebSocket] Connected to live updates server:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Disconnected from live updates server');
    });
  }
  return socket;
}
