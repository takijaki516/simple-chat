import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConvDto } from './dto/create-conv.dto';

@Injectable()
export class ConvService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.conversations.findMany({
      select: {
        id: true,
        title: true,
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.conversations.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createConv(userId: string, payload: CreateConvDto) {
    const conv = await this.prisma.conversations.create({
      data: {
        title: payload.title,
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return { convId: conv.id };
  }
}
