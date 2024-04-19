"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket: Socket = io("http://localhost:3008"); // TODO: env variable

    setSocket(socket);

    socket.on("connect", () => {
      console.log("socket connected provider");
      setIsConnected(true);
    });

    socket.on("error", (error: Error) => {
      console.error(error);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
