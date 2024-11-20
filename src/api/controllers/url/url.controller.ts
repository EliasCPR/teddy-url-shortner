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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUrlDto } from 'src/dtos/create-url-dto';

@Controller()
@ApiTags('URL')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @ApiOperation({ summary: 'Shorten a URL' })
  @ApiBody({ description: 'The original URL to shorten', type: CreateUrlDto })
  @ApiResponse({ status: 201, description: 'Successfully shortened the URL' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
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
  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({ name: 'shortCode', description: 'The shortened code of the URL' })
  @ApiResponse({ status: 302, description: 'Redirecting to the original URL' })
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
