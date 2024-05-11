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
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConvDto } from './dto/create-conv.dto';

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
  // LOG
  private readonly logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, string>();

  constructor(private readonly prismaService: PrismaService) {}

  @WebSocketServer()
  io: Server;

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client.handshake.address);
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.log(
      `handleConnection에서 Number of connected clients: ${this.connectedClients.size}`,
    );
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_room')
  logout(client: Socket, userId: string) {}

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

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('create_conv')
  async createRoom(client: Socket, data: CreateConvDto) {
    const userId = client.userId;
    const { title } = data;

    // TODO: move to conversation service
    const createdConv = await this.prismaService.conversations.create({
      data: {
        title,
        ownerId: userId,
      },
    });

    this.io.emit('created_conv', createdConv.title); // broadcast to all clients
    return createdConv.id;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_conv')
  async joinRoom(client: Socket, data: { convId: string }) {
    const userId = client.userId;
    console.log(
      '🚀 ~ file: chat.gateway.ts:97 ~ joinRoom ~ convId:',
      data.convId,
    );

    // TODO:  move to conversation service
    try {
      const joinedConv = await this.prismaService.conversations.update({
        where: {
          id: data.convId,
        },
        data: {
          participants: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return 'success';
    } catch (error) {
      this.logger.error(error);
      return 'error';
    }
  }
}
