import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email of the user' })
  email: string;

  @ApiProperty({ description: 'Hashed password of the user' })
  password: string;
}
