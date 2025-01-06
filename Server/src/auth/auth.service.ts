/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log(email);
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname'],
    });
    console.log(email, password, user);
    if (!user) {
      console.error('User not found or invalid credentials');
      throw new UnauthorizedException('Invalid username or password');
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return user;
  }
}
