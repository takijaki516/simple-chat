// nest.js guard

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();

    const userId = WsJwtGuard.validateToken(client);
    client.userId = userId;
    return true;
  }

  // socket.io middleware
  static validateToken(client: Socket) {
    const { authorization } = client.handshake.headers; // REVIEW:
    const token: string = authorization.split(' ')[1];

    // TODO: as ??
    const payload = verify(token, 'at-secret') as JwtPayload;

    return payload.userId;
  }
}
