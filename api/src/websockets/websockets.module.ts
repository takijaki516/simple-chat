import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ConvModule } from 'src/conv/conv.module';

@Module({
  imports: [ConvModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class WebsocketsModule {}
