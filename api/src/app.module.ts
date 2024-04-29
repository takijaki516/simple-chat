import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WebsocketsModule } from './websockets/websockets.module';
import { AuthModule } from './auth/auth.module';
import { ConvModule } from './conv/conv.module';

@Module({
  imports: [
    // REVIEW:
    ConfigModule.forRoot({ isGlobal: true }),
    WebsocketsModule,
    AuthModule,
    ConvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
