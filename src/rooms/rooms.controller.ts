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
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@Controller()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('stories/:storyId/rooms')
  create(
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() dto: CreateRoomDto,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.roomsService.create(storyId, req.user.id, dto);
  }

  @Get('stories/:storyId/rooms')
  findAllByStory(@Param('storyId', ParseIntPipe) storyId: number) {
    return this.roomsService.findAllByStory(storyId);
  }

  @Get('rooms/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('rooms/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoomDto,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.roomsService.update(id, req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('rooms/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.roomsService.remove(id, req.user.id);
  }
}