import { Controller, Get } from '@nestjs/common';

@Controller()
export class UrlController {
  constructor() {}

  @Get()
  findUrls(): string {
    return 'Hello World!';
  }
}
