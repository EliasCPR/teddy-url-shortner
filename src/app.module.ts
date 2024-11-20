import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';
import { UserController } from './api/controllers/users/user.controller';
import { UrlController } from './api/controllers/url/url.controller';
import { UrlService } from './services/url/url.service';
import { UrlRepository } from './repositories/url/url.repository';
import { ClickRepository } from './repositories/click/click.repository';

@Module({
  imports: [],
  controllers: [UserController, UrlController],
  providers: [PrismaService, UrlService, UrlRepository, ClickRepository],
})
export class AppModule {}
