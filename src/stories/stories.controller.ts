import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateStoryDto,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.storiesService.create(req.user.id, dto);
  }

  @Get()
  findAll() {
    return this.storiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storiesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStoryDto,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.storiesService.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.storiesService.remove(id, req.user.id);
  }
}