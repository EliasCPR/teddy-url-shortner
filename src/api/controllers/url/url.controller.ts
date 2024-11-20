import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UrlService } from '../../../services/url/url.service';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async shortnerUrl(
    @Body('url') originalUrl: string,
    @Body('userId') userId?: string,
  ): Promise<{ shortUrl: string }> {
    if (!originalUrl) {
      throw new HttpException(
        'Original URL is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const shortCode = await this.urlService.shortenUrl(originalUrl, userId);
    const shortUrl = `http://localhost:3000/${shortCode}`;
    return { shortUrl };
  }

  @Get(':shortCode')
  async handleRedirect(
    @Param('shortCode') shortCode: string,
    @Request() req,
    @Res() res: Response,
  ): Promise<void> {
    const { ip, headers } = req;

    const originalUrl = await this.urlService.handleClick(
      shortCode,
      ip,
      headers['user-agent'],
    );

    res.redirect(originalUrl);
  }
}
