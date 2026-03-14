import { Module } from '@nestjs/common';
import * as path from 'node:path';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoriesModule } from './stories/stories.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [I18nModule.forRoot({
    fallbackLanguage: 'en',
    loaderOptions: {
      path: path.join(__dirname, '../i18n/'),
      watch: true,
    },
    resolvers: [
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
      ],
  }), UsersModule, PrismaModule, AuthModule, StoriesModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
