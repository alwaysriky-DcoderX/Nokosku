import { createContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getStoredToken } from '../api/http';

export const SocketContext = createContext<Socket | null>(null);
const WS_BASE = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket] = useState<Socket>(() => io(WS_BASE, {
    transports: ['websocket'],
    auth: {
      token: getStoredToken()
    }
  }));

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}


