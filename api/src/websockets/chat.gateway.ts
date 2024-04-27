import {
  Logger,
  OnModuleInit,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketExceptionFilter } from './ws-exception.filter';

@WebSocketGateway({
  cors: {
    // TODO:
    origin: 'http://localhost:3000',
  },
})
@UseFilters(new WebsocketExceptionFilter())
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);

  private connectedClients = new Map<string, string>();
  private clientNicknames = new Map<string, string>();
  // TODO: add room

  @WebSocketServer()
  io: Server;

  afterInit() {
    this.logger.log('initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { sockets } = this.io.sockets;
    this.connectedClients.set(client.id, client.handshake.address);
    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  // @UsePipes(new ValidationPipe())
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id : ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: 'wrong data that wil make the test fail',
    };
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

  @SubscribeMessage('newMsg')
  simpleHandler(@MessageBody() body: any) {
    console.log('받은 메시지', body);
    // send message to all connected clients
    // this.server.emit('text-chat', {
    //   ...message,
    //   time: new Date().toDateString(),
    // });
  }

  /**
   *
   * socket.request 로 request 정보를 가져올 수 있음
   * const ip = req['headers']['x-forwarded-for'] || req.connection.remoteAddress
   * socket.id 는 소켓 연결된 고유한 클라이언트 식별자
   *
   *
   */
}
