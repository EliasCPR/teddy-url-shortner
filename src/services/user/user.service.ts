import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserRepository } from 'src/repositories/user/user.repository';
import { PasswordHashService } from '../hash.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHashService: PasswordHashService,
  ) {}

  async createUser(email: string, password: string): Promise<User> {
    // Gera o hash da senha antes de salvar
    const passwordHash = await this.passwordHashService.hashPassword(password);
    // Cria o usuário com o email e senha hashada
    return this.userRepository.createUser(email, passwordHash);
  }

  // Método para autenticar um usuário (verificar a senha)
  async validateUserPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return false; // Se o usuário não for encontrado, retorna false
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

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.updateUser(id, data);
  }

  async softDeleteUser(id: string): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.softDeleteUser(id);
  }
}
