import { Controller, Get } from '@nestjs/common';

@Controller()
export class UserController {
  constructor() {}

  @Get()
  findUser(): string {
    return 'Hello World!';
  }
}
