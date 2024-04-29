import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';

import { ConvService } from './conv.service';
import { CreateConvDto } from './dto/create-conv.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Public()
@Controller('conv')
export class ConvController {
  constructor(private convService: ConvService) {}

  @Get()
  findAll() {
    return this.convService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const conv = await this.convService.findOne(id);
    if (!conv) {
      // TODO: add HTTPSTATUSCODE
      return { message: 'conversation not found' };
    } else {
      return { message: 'conversation found', convId: conv.id };
    }
  }

  @Post()
  async createConv(
    @GetCurrentUser() user: User,
    @Body() payload: CreateConvDto,
  ) {
    const { convId } = await this.convService.createConv(user.id, payload);

    return { message: 'successfully created conversation', convId };
  }
}
