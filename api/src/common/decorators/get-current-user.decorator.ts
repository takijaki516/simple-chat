import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshJwtPayload } from 'src/types/refresh-jwt-payload.type';

export const GetCurrentUser = createParamDecorator(
  (data: keyof RefreshJwtPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    // passport strategy sets user to request object
    if (!data) return request.user;
    return request.user[data];
  },
);
