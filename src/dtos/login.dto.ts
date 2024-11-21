import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user. It must be a valid email format.',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password  of the user.',
    example: 'hashedpassword123',
    required: false,
  })
  password?: string;
}
