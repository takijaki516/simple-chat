import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { Tokens } from './types/tokens.type';
import { JwtPayload } from './types/jwt-payload.type';
import { CreateUserDto } from './dto/create-user.dto';

const REFRESH_TOKEN_SALT = 10;
const HAHS_PASSWORD_SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // TODO: add prisma transaction??
  async signUp(dto: CreateUserDto): Promise<Tokens> {
    let user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      throw new ForbiddenException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, HAHS_PASSWORD_SALT);

    user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
      },
    });

    const tokens = await this.getTokens(user.id, user.email);

    // TODO: move this to controller
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async login(email: string, password: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.user.update({
      where: {
        id: userId,
        // REVIEW: prisma query
        refreshToken: {
          not: null,
        },
      },
      data: {
        // REVIEW: refreshtoken을 만료처리
        refreshToken: null,
      },
    });

    return true;
  }

  // accessToken을 새로 받는것임 refresh token이 필요함
  async refreshToken(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const rtMatches = await bcrypt.compare(rt, user.refreshToken);
    if (!rtMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  // REVIEW:
  async updateRefreshTokenHash(userId: string, rt: string): Promise<void> {
    // TODO: expire data도 저장
    const hashedRt = await bcrypt.hash(rt, REFRESH_TOKEN_SALT);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRt,
      },
    });
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      userId: userId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async findOne(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  // remove refresh token from db
  async removeRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }
}
