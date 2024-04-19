import {
  OnModuleInit,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { IsNotEmpty, IsString } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { WebsocketExceptionFilter } from './ws-exception.filter';

class ChatMessage {
  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}

@WebSocketGateway({
  cors: {
    // TODO:
    origin: 'http://localhost:3000',
  },
})
@UseFilters(new WebsocketExceptionFilter())
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`new socket connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('chat-message')
  // @UsePipes(new ValidationPipe())
  handleMessage(
    @MessageBody() message: ChatMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('받은 메시지', message);
    // send message to all connected clients
    this.server.emit('text-chat', {
      ...message,
      time: new Date().toDateString(),
    });
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
