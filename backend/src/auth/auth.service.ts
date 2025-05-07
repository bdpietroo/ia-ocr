import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async validateUser(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    async login(user: {id: number; email: string }): Promise<{ accessToken: string }> {
        const payload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
}   
