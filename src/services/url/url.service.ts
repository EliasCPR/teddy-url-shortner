import { Injectable } from '@nestjs/common';
import { ClickRepository } from '../../repositories/click/click.repository';
import { UrlRepository } from '../../repositories/url/url.repository';

@Injectable()
export class UrlService {
  constructor(
    private readonly urlRepository: UrlRepository,
    private readonly clickRepository: ClickRepository,
  ) {}

  // Método para encurtar a URL
  async shortenUrl(originalUrl: string, userId?: string): Promise<string> {
    const shortCode = this.generateRandomShortCode();

    await this.urlRepository.createUrl(shortCode, originalUrl, userId);

    return shortCode;
  }

  // Método para buscar a URL original pelo shortCode
  async findByShortCode(
    shortCode: string,
  ): Promise<{ originalUrl: string } | null> {
    return this.urlRepository.findUrlByShortCode(shortCode);
  }

  // Método que registra o clique e retorna a URL original
  async handleClick(
    shortCode: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<string> {
    // Encontra a URL original pelo shortCode
    const url = await this.urlRepository.findUrlByShortCode(shortCode);
    if (!url) {
      throw new Error('URL não encontrada');
    }

    // Cria um novo clique na tabela Click
    await this.clickRepository.createClick(url.id, ipAddress, userAgent);

    // Retorna a URL original para redirecionamento
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
}
