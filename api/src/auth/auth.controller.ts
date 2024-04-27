import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
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

  // NOTE: just for testing
  // REVIEW: refresh guard를 사용하면 refresh guard가 더먼저 사용된다. guard의 순서?
  @UseGuards(RefreshJwtGuard)
  @Get('authenticate')
  async user(@GetCurrentUser() user: User) {
    return user;
  }

  @Public()
  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  async login(
    @Body() { email, password }: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.login(
      email,
      password,
    );

    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    // REVIEW: refresh token을 넘겨줘야 하나?
    return { message: 'login success', access_token, refresh_token };
  }

  @Public()
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.signUp(createUserDto);

    res.cookie('refresh_token', refresh_token, { httpOnly: true });

    return { message: 'signup success', access_token, refresh_token };
  }

  @UseGuards(RefreshJwtGuard)
  @Public()
  @Post('refresh')
  async refresh(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
    // TODO: add cookie type
  ) {
    const { access_token, refresh_token } = await this.authService.getTokens(
      user.id,
      user.email,
    );

    // hash refresh token and update to db
    await this.authService.updateRefreshTokenHash(user.id, refresh_token);

    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    return { message: 'refreshed token', access_token, refresh_token };
  }

  // TODO: type for cookies
  @UseGuards(RefreshJwtGuard)
  @Post('logout')
  async logout(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('refresh_token', { httpOnly: true }); // cookie options must match
    // remove refresh token from db
    await this.authService.removeRefreshToken(user.id);
    return { message: 'logout success' };
  }
}
