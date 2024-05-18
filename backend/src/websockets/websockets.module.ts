import { Module } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';
import { ConvModule } from 'src/conv/conv.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConvModule, PrismaModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class WebsocketsModule {}
