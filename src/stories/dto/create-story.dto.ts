import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Visibility } from '@prisma/client';

export class CreateStoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  slug: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;
}
