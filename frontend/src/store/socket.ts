import { type Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { create } from "zustand";

interface socketStore {
  socket: Socket | null;
  setSocket: (token: string) => void;
}

const connectSocket = (token: string) =>
  io("http://localhost:3008", {
    withCredentials: true,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

export const useSocketStore = create<socketStore>((set) => ({
  socket: null,
  setSocket: (token) => set({ socket: connectSocket(token) }),
}));
