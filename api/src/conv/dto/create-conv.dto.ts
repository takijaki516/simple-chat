import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConvDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;
}
