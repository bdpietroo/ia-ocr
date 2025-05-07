import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service'; 
import { UserService } from '../user.service';


@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'admin123',
            signOptions: { expiresIn: '1h' }, // Token expiration time
        }),
    ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, PrismaService],
})
export class AuthModule {}
