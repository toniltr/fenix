import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  create(authorId: number, dto: CreateStoryDto) {
    return this.prisma.story.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        summary: dto.summary,
        visibility: dto.visibility ?? 'PRIVATE',
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            uuid: true,
            email: true,
            username: true,
          },
        },
        startRoom: true,
      },
    });
  }

  findAll() {
    return this.prisma.story.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            uuid: true,
            username: true,
          },
        },
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            uuid: true,
            username: true,
          },
        },
        rooms: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        startRoom: true,
      },
    });

    if (!story) {
      throw new NotFoundException(
        this.i18n.t('stories.NOT_FOUND', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return story;
  }

  async update(id: number, userId: number, dto: UpdateStoryDto) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!story) {
      throw new NotFoundException(
        this.i18n.t('stories.NOT_FOUND', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException(
        this.i18n.t('stories.FORBIDDEN_UPDATE', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    return this.prisma.story.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        summary: dto.summary,
        visibility: dto.visibility,
        status: dto.status,
      },
      include: {
        author: {
          select: {
            id: true,
            uuid: true,
            username: true,
          },
        },
        startRoom: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const story = await this.prisma.story.findUnique({
      where: { id },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!story) {
      throw new NotFoundException(
        this.i18n.t('stories.NOT_FOUND', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException(
        this.i18n.t('stories.FORBIDDEN_DELETE', {
          lang: I18nContext.current()?.lang,
        }),
      );
    }

    await this.prisma.story.delete({
      where: { id },
    });

    return {
      message: this.i18n.t('stories.DELETE_SUCCESS', {
        lang: I18nContext.current()?.lang,
      }),
    };
  }
}