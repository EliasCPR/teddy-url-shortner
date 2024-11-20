import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/database/prisma.service';
import { UserController } from './api/controllers/users/user.controller';
import { UrlController } from './api/controllers/url/url.controller';

@Module({
  imports: [],
  controllers: [UserController, UrlController],
  providers: [PrismaService],
})
export class AppModule {}
