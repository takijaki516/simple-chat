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
  constructor(private convService: ConvService) {}

  private readonly logger = new Logger(ChatGateway.name);
  // TODO:
  private connectedClients = new Map<string, string>();
  private rooms = new Map<string, Array<UserInfo>>();

  @WebSocketServer()
  io: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }

  handleConnection(client: Socket) {
    const { sockets } = this.io.sockets;
    this.connectedClients.set(client.id, client.handshake.address); // REVIEW:
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket, data: any) {
    this.logger.log(`Message received from client id : ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
  }

  @SubscribeMessage('join_room')
  joinRoom(client: Socket, roomId: string) {
    console.log('🚀 ~ file: chat.gateway.ts:64 ~ joinRoom ~ client:', client);

    if (!this.rooms.has(roomId)) {
      // this.rooms.set(roomId, [{userId}]);
    }

    client.join(roomId);
    client.to(roomId).emit(`user `);
  }

  @SubscribeMessage('login_client')
  async loginClient(client: Socket, clientId: string) {
    const socketId = client.id;
    const responsePayload = { status: 'login', id: socketId };

    // 브로드캐스트
    this.io.emit('client_info', responsePayload);
  }

  @SubscribeMessage('logout')
  async logout(client: Socket, id: string) {
    const socketId = client.id;
    if (id !== '' && id !== undefined) {
      const responsePayload = { status: 'offline', id: id };
      this.io.emit('client_info', responsePayload);
    }
  }
}
