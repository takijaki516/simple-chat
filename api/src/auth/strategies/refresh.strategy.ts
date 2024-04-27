import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // TODO: check if expires
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies.refresh_token,
      ]),
      ignoreExpiration: true, // REVIEW:
      secretOrKey: config.get<string>('REFRESH_TOKEN_SECRET'),
    });
  }

  // REVIEW: express 의 request 타입이어야 하나?
  // TODO: rename
  async validate(payload: { userId: string }) {
    // check if refresh token is valid
    const user = await this.authService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  // private static extractRefreshToken(request: Request): string | null {
  //   if (
  //     request.cookies &&
  //     'refresh_token' in request.cookies &&
  //     request.cookies.refresh_token.length > 0
  //   ) {
  //   }
  // }
}
