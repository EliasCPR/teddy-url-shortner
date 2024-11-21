import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
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
import { CreateUrlDto } from 'src/dtos/create-url.dto';
import { JwtAuthGuard } from 'src/api/guards/auth.guard';

@Controller()
@ApiTags('URL')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Shorten a URL (optional authentication)' })
  @ApiBody({ description: 'The original URL to shorten', type: CreateUrlDto })
  @ApiResponse({ status: 201, description: 'Successfully shortened the URL' })
  @ApiResponse({ status: 400, description: 'Invalid URL' })
  async shortnerUrl(
    @Body('url') originalUrl: string,
    @Request() req: any,
  ): Promise<{ shortUrl: string; userId?: string }> {
    if (!originalUrl) {
      throw new HttpException(
        'Original URL is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = req.user?.userId || null;

    const shortCode = await this.urlService.shortenUrl(originalUrl, userId);
    const shortUrl = `http://localhost:3000/${shortCode}`;

    return userId ? { shortUrl, userId } : { shortUrl };
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

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List URLs created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of URLs with click counts' })
  async listUrls(@Request() req: any) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.urlService.findUrlsByUserWithClicks(userId);
  }

  @Patch(':shortCode')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Edit the destination URL' })
  @ApiParam({ name: 'shortCode', description: 'Shortened code of the URL' })
  @ApiBody({ description: 'New destination URL', type: CreateUrlDto })
  @ApiResponse({ status: 200, description: 'URL updated successfully' })
  async editUrl(
    @Param('shortCode') shortCode: string,
    @Body('url') newUrl: string,
    @Request() req: any,
  ) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.urlService.updateUrl(shortCode, newUrl, userId);
  }

  @Delete(':shortCode')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a shortened URL' })
  @ApiParam({ name: 'shortCode', description: 'Shortened code of the URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  async deleteUrl(@Param('shortCode') shortCode: string, @Request() req: any) {
    const userId = req.user?.userId;

    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return this.urlService.softDeleteUrl(shortCode, userId);
  }
}
