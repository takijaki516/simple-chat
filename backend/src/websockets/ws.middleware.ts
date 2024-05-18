import { Socket } from 'socket.io';
import { WsJwtGuard } from './ws-jwt.guard';

export type SocketIOMiddleware = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
  return (client, next) => {
    try {
      // TODO: .env를 어떻게 사용할지
      WsJwtGuard.validateToken(client);
      next();
    } catch (error) {
      next(error);
    }
  };
};
