import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(login: string, password: string) {
    // Перевірка чи користувач вже існує
    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    });

    if (existingUser) {
      throw new ForbiddenException('User already exists');
    }

    // Хешування пароля
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
const now = Date.now();
    // Створення користувача
    const user = await this.prisma.user.create({
      data: {
        login,
      password: hashedPassword,
      version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });

    return user ;
  }

  async login(login: string, password: string) {
    // Пошук користувача
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // Перевірка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    // Генерація токенів
    return this.generateTokens(user.id, user.login);
  }

 async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      });

      return this.generateTokens(payload.userId, payload.login);
    } catch (error) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  private generateTokens(userId: string, login: string) {
    const payload = { userId, login };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: 600,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_KEY'),
      expiresIn: 86400,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
