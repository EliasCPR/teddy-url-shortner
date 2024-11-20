import { Injectable } from '@nestjs/common';
import { Url } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class UrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUrl(
    shortCode: string,
    originalUrl: string,
    userId?: string,
  ): Promise<Url> {
    return this.prisma.url.create({
      data: { shortCode, originalUrl, userId },
    });
  }

  async findUrlByShortCode(shortCode: string): Promise<Url | null> {
    return this.prisma.url.findUnique({
      where: { shortCode },
    });
  }

  async findUrlsByUser(userId: string): Promise<Url[]> {
    return this.prisma.url.findMany({
      where: { userId, deletedAt: null },
    });
  }

  async updateUrl(shortCode: string, data: Partial<Url>): Promise<Url> {
    return this.prisma.url.update({
      where: { shortCode },
      data,
    });
  }

  async softDeleteUrl(shortCode: string): Promise<Url> {
    return this.prisma.url.update({
      where: { shortCode },
      data: { deletedAt: new Date() },
    });
  }
}
