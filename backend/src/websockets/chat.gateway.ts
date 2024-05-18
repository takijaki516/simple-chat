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
  username: string;
  socketId: string;
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

  // TODO: use redis
  // NOTE: array vs map
  private convUsers = new Map<string, Map<string, UserInfo>>();

  private convInfo = new Map<string, { title: string; ownerId: string }>();

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
  @SubscribeMessage('create_conv')
  async createConv(client: Socket, data: CreateConvDto) {
    const userId = client.userId;
    const { title } = data;

    // TODO: move to conversation service
    const createdConv = await this.prismaService.conversations.create({
      data: {
        title,
        ownerId: userId,
      },
    });

    this.convUsers.set(createdConv.id, new Map());

    this.io.emit('created_conv', createdConv.title); // broadcast to all clients
    return createdConv.id;
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_conv')
  async joinRoom(client: Socket, { convId }: { convId: string }) {
    // TODO:  move to conversation service
    try {
      const { username: username } = await this.prismaService.user.findUnique({
        where: {
          id: client.userId,
        },
        select: {
          username: true,
        },
      });

      client.join(convId);
      this.convUsers
        .get(convId)
        .set(client.userId, { socketId: client.id, username });

      // broadcast to all clients in the room including sender
      this.io.in(convId).emit('joined_conv', client.userId); // TODO:

      return 'success';
    } catch (error) {
      this.logger.error(error);
      return 'error';
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_conv')
  leaveConv(client: Socket, { convId }: { convId: string }) {
    client.leave(convId);
    this.convUsers.get(convId).delete(client.userId);
    // broadcast to all clients in the room excluding sender
    client.to(convId).emit('left_conv', client.userId); // TODO:

    return {
      status: 'success',
      data: {},
    };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('delete_conv')
  async deleteConv(client: Socket, { convId }: { convId: string }) {
    const userId = client.userId;

    // TODO: move to conversation service
    const deletedConv = await this.prismaService.conversations.delete({
      where: {
        ownerId: userId,
        id: convId,
      },
    });

    const convUsers = this.convUsers.get(convId);

    convUsers.forEach((userInfo, userId) => {
      this.io.to(userInfo.socketId).emit('deleted_conv', deletedConv.id);
    });

    this.convUsers.delete(deletedConv.id);

    return { status: 'success' };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('message')
  userMessage(
    client: Socket,
    data: { convId: string; username: string; message: string },
  ) {
    const { convId, message, username } = data;
    const userId = client.userId;
    // broadcast to all clients in the room including sender
    this.io.in(convId).emit('broadcast_message', { userId, message, username });
  }
}
