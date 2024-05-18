import { IsString } from 'class-validator';

export class CreateConvDto {
  @IsString()
  title: string;
}
