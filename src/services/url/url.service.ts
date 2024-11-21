import { Injectable } from '@nestjs/common';
import { ClickRepository } from '../../repositories/click/click.repository';
import { UrlRepository } from '../../repositories/url/url.repository';
import { Url } from '@prisma/client';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly clickRepository: ClickRepository,
  ) {}

  async shortenUrl(originalUrl: string, userId?: string): Promise<string> {
    const shortCode = this.generateRandomShortCode();

    await this.urlRepository.createUrl(shortCode, originalUrl, userId);

    return shortCode;
  }

  async findByShortCode(
    shortCode: string,
  ): Promise<{ originalUrl: string } | null> {
    return this.urlRepository.findUrlByShortCode(shortCode);
  }

  async handleClick(
    shortCode: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<string> {
    const url = await this.urlRepository.findUrlByShortCode(shortCode);
    if (!url) {
      throw new Error('URL não encontrada');
    }
    await this.clickRepository.createClick(url.id, ipAddress, userAgent);

    return url.originalUrl;
  }

  /**
   * Gera um código aleatório de até 6 caracteres utilizando Base62.
   * @returns shortCode.
   */
  private generateRandomShortCode(): string {
    const BASE62_CHARACTERS =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortCode = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * BASE62_CHARACTERS.length);
      shortCode += BASE62_CHARACTERS[randomIndex];
    }

    return shortCode;
  }

  async findUrlsByUserWithClicks(userId: string) {
    return this.urlRepository.findUrlsByUserWithClicks(userId);
  }

  async updateUrl(
    shortCode: string,
    newUrl: string,
    userId: string,
  ): Promise<Url> {
    return this.urlRepository.updateUrl(shortCode, newUrl, userId);
  }

  async softDeleteUrl(shortCode: string, userId: string): Promise<Url> {
    return this.urlRepository.softDeleteUrl(shortCode, userId);
  }
}
