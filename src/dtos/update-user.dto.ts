import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'Email of the user' })
  email?: string;

  @ApiPropertyOptional({ description: 'Hashed password of the user' })
  passwordHash?: string;
}
