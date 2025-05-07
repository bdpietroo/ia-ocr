import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user.service';

@Controller('auth')
export class AuthController {
    constructor (
        private readonly authService: AuthService, 
        private readonly userService: UserService, 
    ) {}

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
      const { email, password } = body;

      // Verifica se o usuário já existe
      const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email já cadastrado');
        }

        // Cria o novo usuário
        return this.userService.createUser(email, password);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;

        // Verifica se o usuário existe
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new BadRequestException('Credencias inválidas.');
        }

        // Valida senha
        const isPasswordValid = await this.authService.validateUser(password, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Credenciais inválidas.');
        }

        // Gera o token JWT
        return this.authService.login({ id: user.id, email: user.email });
    }
}


