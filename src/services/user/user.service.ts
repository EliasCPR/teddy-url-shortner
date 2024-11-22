import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from 'src/repositories/user/user.repository';
import { PasswordHashService } from '../hash.service';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    const passwordHash = await this.passwordHashService.hashPassword(password);
    return this.userRepository.createUser(email, passwordHash);
  }

  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return false;
    }
    return this.passwordHashService.comparePassword(
      password,
      user.passwordHash,
    );
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    let passwordHash: string | undefined;

    if (data.password) {
      passwordHash = await this.passwordHashService.hashPassword(data.password);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updateData } = data;

    return this.userRepository.updateUser(id, {
      ...updateData,
      ...(passwordHash && { passwordHash }),
    });
  }

  async softDeleteUser(id: string): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.softDeleteUser(id);
  }
}
