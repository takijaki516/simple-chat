import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessJwtStrategy } from './strategies/access.strategy';
import { RefreshJwtStrategy } from './strategies/refresh.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

// TODO: refactor .env
export const tempSecret = 'sample secret';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({})],
  // strategies are providers
  providers: [
    AuthService,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    // 이렇게 해도 global로 등록된다.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
