import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'Unique identifier for the user.',
    example: 'fbb27c75-d81f-40f0-8d6c-67b85f32c233',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user. It must be a valid email format.',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description:
      'Password hash of the user. This is a hashed value and should not be returned in plain text.',
    example: 'hashedpassword123',
    required: false,
  })
  passwordHash?: string;

  @ApiProperty({
    description: 'Date when the user was created.',
    example: '2024-11-20T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date when the user was deleted. Null if not deleted.',
    example: null,
    required: false,
  })
  deletedAt?: string | null;
}
