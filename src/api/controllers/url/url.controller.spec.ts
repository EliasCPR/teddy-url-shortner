import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from '../../../services/url/url.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: UrlService;

  const mockUrlService = {
    shortenUrl: jest.fn(),
    handleClick: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: mockUrlService,
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
    urlService = module.get<UrlService>(UrlService);
  });

  describe('shortenUrl', () => {
    it('should return a shortened URL', async () => {
      const originalUrl = 'https://example.com';
      const userId = '123';
      const shortCode = 'abc123';
      const shortUrl = `http://localhost:3000/${shortCode}`;

      mockUrlService.shortenUrl.mockResolvedValue(shortCode);

      // Passando o corpo corretamente como seria no controller
      const result = await controller.shortnerUrl(
        { url: originalUrl, userId } as any, // Passando o corpo como um tipo de `any`
      );

      expect(result).toEqual({ shortUrl });
      expect(urlService.shortenUrl).toHaveBeenCalledWith(originalUrl, userId);
    });

    it('should throw an error if originalUrl is not provided', async () => {
      try {
        // Passando uma URL vazia como no caso de erro
        await controller.shortnerUrl({ url: '', userId: '123' } as any);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect(error.message).toBe('Original URL is required');
      }
    });
  });

  describe('handleRedirect', () => {
    it('should redirect to the original URL', async () => {
      const shortCode = 'abc123';
      const ip = '127.0.0.1';
      const userAgent = 'Mozilla/5.0';
      const originalUrl = 'https://example.com';
      const res: Partial<Response> = {
        redirect: jest.fn(),
      };

      mockUrlService.handleClick.mockResolvedValue(originalUrl);

      await controller.handleRedirect(
        { shortCode } as any, // Garantir que `shortCode` é passado como o parâmetro correto
        { ip, headers: { 'user-agent': userAgent } } as any, // Usar `any` aqui para simular a requisição
        res as Response,
      );

      expect(urlService.handleClick).toHaveBeenCalledWith(
        shortCode,
        ip,
        userAgent,
      );
      expect(res.redirect).toHaveBeenCalledWith(originalUrl);
    });

    it('should throw an error if the URL does not exist', async () => {
      const shortCode = 'invalidCode';
      const ip = '127.0.0.1';
      const userAgent = 'Mozilla/5.0';

      mockUrlService.handleClick.mockResolvedValue(null);

      try {
        const res: Partial<Response> = {
          redirect: jest.fn(),
        };
        await controller.handleRedirect(
          { shortCode } as any, // Passando como `any` para evitar problemas de tipagem
          { ip, headers: { 'user-agent': userAgent } } as any,
          res as Response,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe('URL not found');
      }
    });
  });
});
