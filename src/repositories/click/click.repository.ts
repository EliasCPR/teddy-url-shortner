import { Injectable } from '@nestjs/common';
import { Click } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class ClickRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClick(
    urlId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Click> {
    return this.prisma.click.create({
      data: { urlId, ipAddress, userAgent },
    });
  }

  async findClicksByUrlId(urlId: string): Promise<Click[]> {
    return this.prisma.click.findMany({
      where: { urlId },
    });
  }

  async countClicksByUrlId(urlId: string): Promise<number> {
    return this.prisma.click.count({
      where: { urlId },
    });
  }
}
