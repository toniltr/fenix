import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  private lang() {
    return I18nContext.current()?.lang;
  }

  async create(storyId: number, userId: number, dto: CreateRoomDto) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!story) {
      throw new NotFoundException(
        this.i18n.t('stories.NOT_FOUND', { lang: this.lang() }),
      );
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException(
        this.i18n.t('rooms.FORBIDDEN_CREATE', { lang: this.lang() }),
      );
    }

    return this.prisma.room.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        orderIndex: dto.orderIndex ?? 0,
        storyId,
      },
    });
  }

  findAllByStory(storyId: number) {
    return this.prisma.room.findMany({
      where: { storyId },
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: {
            actors: true,
            outgoingLinks: true,
            incomingLinks: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        story: {
          select: {
            id: true,
            uuid: true,
            slug: true,
            authorId: true,
          },
        },
        actors: true,
        outgoingLinks: {
          include: {
            toRoom: {
              select: {
                id: true,
                uuid: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        incomingLinks: {
          include: {
            fromRoom: {
              select: {
                id: true,
                uuid: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException(
        this.i18n.t('rooms.NOT_FOUND', { lang: this.lang() }),
      );
    }

    return room;
  }

  async update(id: number, userId: number, dto: UpdateRoomDto) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        story: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException(
        this.i18n.t('rooms.NOT_FOUND', { lang: this.lang() }),
      );
    }

    if (room.story.authorId !== userId) {
      throw new ForbiddenException(
        this.i18n.t('rooms.FORBIDDEN_UPDATE', { lang: this.lang() }),
      );
    }

    return this.prisma.room.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        orderIndex: dto.orderIndex,
      },
    });
  }

  async remove(id: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        story: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException(
        this.i18n.t('rooms.NOT_FOUND', { lang: this.lang() }),
      );
    }

    if (room.story.authorId !== userId) {
      throw new ForbiddenException(
        this.i18n.t('rooms.FORBIDDEN_DELETE', { lang: this.lang() }),
      );
    }

    await this.prisma.room.delete({
      where: { id },
    });

    return {
      message: this.i18n.t('rooms.DELETE_SUCCESS', { lang: this.lang() }),
    };
  }
}