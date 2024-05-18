import { JwtPayload } from './jwt-payload.type';

export type RefreshJwtPayload = JwtPayload & { refreshToken: string };
