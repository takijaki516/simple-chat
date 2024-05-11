import { Controller, Get, Param } from '@nestjs/common';

import { ConvService } from './conv.service';
import { Public } from 'src/common/decorators/public.decorator';

export interface IConvInfo {
  name: string;
  id: string;
  owner: string;
}

// TODO: add guard
@Controller('conv')
export class ConvController {
  constructor(private convService: ConvService) {}

  @Public()
  @Get()
  async findAll(): Promise<Array<IConvInfo>> {
    // TODO: response type
    const convs = await this.convService.findAll();

    return convs.map((conv) => ({
      id: conv.id,
      name: conv.title,
      owner: conv.owner.username,
    }));
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const conv = await this.convService.findById(id);
    if (!conv) {
      return { message: 'conversation not found' };
    } else {
      return { message: 'conversation found', data: conv };
    }
  }
}
