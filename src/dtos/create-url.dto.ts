import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'The original URL to shorten',
    example: 'https://example.com',
  })
  url: string;
}
