import { Body, Controller, Logger, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { type Response } from 'express';
import { type User } from '@prisma/client';

import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshJwtGuard } from 'src/common/guards/refresh-jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, username, userId } =
      await this.authService.login(email, password);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    });

    return {
      message: 'login success',
      data: {
        username,
        refresh_token,
        access_token,
        userId,
      },
    };
  }

  @Public()
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token, username, userId } =
      await this.authService.signUp(createUserDto);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    });

    return {
      message: 'signup success',
      data: {
        username,
        refresh_token,
        access_token,
        userId,
      },
    };
  }

  @UseGuards(RefreshJwtGuard)
  @Public()
  @Post('refresh')
  async refresh(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.getTokens(
      user.id,
      user.email,
    );

    // hash refresh token and update to db
    await this.authService.updateRefreshTokenHash(user.id, refresh_token);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    });

    return {
      message: 'refreshed token',
      data: {
        username: user.username,
        refresh_token,
        access_token,
        userId: user.id,
      },
    };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('logout')
  async logout(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    // NOTE: cookie options must match
    res.clearCookie('refresh_token', {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      domain: 'localhost',
      path: '/',
    });

    await this.authService.logout(user.id);

    return { message: 'logout success' };
  }
}
