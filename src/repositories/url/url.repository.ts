import { Injectable } from '@nestjs/common';
import { Url } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';

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

  async findUrlsByUserWithClicks(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId, deletedAt: null },
      select: {
        shortCode: true,
        originalUrl: true,
        click: true,
      },
    });

    return urls.map((url) => ({
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      click_count: url.click.length,
      click: url.click,
    }));
  }

  async updateUrl(
    shortCode: string,
    newUrl: string,
    userId: string,
  ): Promise<Url> {
    return this.prisma.url.update({
      where: { shortCode, userId },
      data: {
        originalUrl: newUrl,
      },
    });
  }

  async softDeleteUrl(shortCode: string, userId: string): Promise<Url> {
    return this.prisma.url.update({
      where: { shortCode, userId },
      data: { deletedAt: new Date() },
    });
  }

  async countClicksByUrlId(urlId: string): Promise<number> {
    const clicks = await this.prisma.click.count({
      where: { urlId },
    });
    return clicks;
  }
}
