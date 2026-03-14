import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}