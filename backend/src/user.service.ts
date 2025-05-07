import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um novo usuário com senha criptografada
  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
    return this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  // Busca um usuário pelo e-mail
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}