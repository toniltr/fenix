import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Visibility, StoryStatus } from '@prisma/client';

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsEnum(Visibility)
  visibility?: Visibility;

  @IsOptional()
  @IsEnum(StoryStatus)
  status?: StoryStatus;
}