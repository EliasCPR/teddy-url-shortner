import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { User } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { UserDto } from 'src/dtos/user.dto';
import { AuthService } from 'src/services/auth.service';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtAuthGuard } from 'src/api/guards/auth.guard';
import { Request } from 'express';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(
      createUserDto.email,
      createUserDto.password,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', description: 'User email' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated', type: UserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async softDeleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.softDeleteUser(id);
  }

  @ApiTags('Authentication')
  @Post('login')
  @ApiBody({ description: 'Login data', type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }
}
