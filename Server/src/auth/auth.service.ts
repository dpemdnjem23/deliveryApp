/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService, // JwtService 주입
  ) {}

  generateAccessToken(payload: object): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' }); // 15분 유효기간
  }

  // RefreshToken 생성
  generateRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' }); // 7일 유효기간
  }

  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET || 'yourSecretKey',
    });
  }

  async tokenValidateUser(payload) {
    const { email } = payload;
    const user: Users = await this.userRepository.findOne({
      select: ['id', 'nickname', 'email', 'password'],
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    console.log(email);
    const user = await this.userRepository.findOne({
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
