import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

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
      },
    });
  }

  findById(id: string) {
    return this.prisma.conversations.findUnique({
      where: {
        id: id,
      },
    });
  }
}
