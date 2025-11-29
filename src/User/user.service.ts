import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomUUID } from 'crypto';
import { UserEntity } from './entities/user.entity';
import { User, UserResponse } from './interfaces/user.interfase';

@Injectable()
export class UsersService {
    private users: UserEntity[] = [];

  create(dto: CreateUserDto): UserResponse {
    const now = Date.now();

    const user: UserEntity = {
      id: randomUUID(),
      login: dto.login,
      password: dto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.users.push(user);

    const { password, ...safeUser } = user;
    return safeUser;
  }

  findAll(): UserResponse[] {
  return this.users.map(({ password, ...safeUser }) => safeUser);
}

  findOne(id: string): UserResponse {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }

  update(id: string, dto: UpdateUserDto): UserResponse {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password != dto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }
  
    user.password = dto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    const { password, ...safeUser } = user;
    return safeUser;
  }

  remove(id: string): void {
    const before = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    if (this.users.length === before) {
      throw new NotFoundException('User not found');
    }
  }
}