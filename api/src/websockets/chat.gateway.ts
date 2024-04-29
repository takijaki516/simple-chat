import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { WebsocketExceptionFilter } from './ws-exception.filter';
import { SocketAuthMiddleware } from './ws.middleware';
import { WsJwtGuard } from './ws-jwt.guard';
import { ConvService } from 'src/conv/conv.service';

interface UserInfo {
  userId: string;
  nickname: string;
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  },
})
@UseFilters(new WebsocketExceptionFilter()) // REVIEW:
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, string>();
  private rooms = new Map<string, Array<UserInfo>>();

  @WebSocketServer()
  io: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;
    // REVIEW
    this.connectedClients.set(client.id, client.handshake.address);
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  // NOTE: db에 저장되어 있음
  // TODO: memory에 저장하기F
  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('create_room')
  // createRoom(client: Socket, roomId: any) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_room')
  joinRoom(client: Socket, data: { roomId: string }) {
    const { roomId } = data;
    client.join(roomId);
  }

  // @UseGuards(WsJwtGuard)
  // @SubscribeMessage('leave_room')
  // logout(client: Socket, userId: string) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('user_message')
  userMessage(client: Socket, data: { roomId: string; message: string }) {
    const { roomId, message } = data;
    console.log(
      '🚀 ~ file: chat.gateway.ts:84 ~ userMessage ~ roomId:',
      roomId,
    );
    const userId = client.userId;
    // broadcast to all clients in the room including sender
    this.io.in(roomId).emit('broadcast_message', { userId, message });
  }
}
