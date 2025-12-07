import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }
    const now = Date.now();
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        password: dto.password,
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    
    return users.map(({ password, ...user }) => user);
  }
  async findById(id: string): Promise<User | null> {
      return this.prisma.user.findUnique({
        where: { id },
      });
    }
  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
  const user = await this.prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  if (user.password != dto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }
    const now = Date.now();
  const updatedUser = await this.prisma.user.update({
    where: { id },
    data: {
      password: dto.newPassword,
      version: user.version + 1,
      updatedAt: now,
    },
  });

  const { password, ...safeUser } = updatedUser;
  return safeUser;
}

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
