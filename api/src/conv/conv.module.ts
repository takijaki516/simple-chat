import { Module } from '@nestjs/common';
import { ConvController } from './conv.controller';
import { ConvService } from './conv.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConvController],
  providers: [ConvService],
  exports: [ConvService],
})
export class ConvModule {}
