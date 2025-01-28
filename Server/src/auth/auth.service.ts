/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService, // JwtService 주입
  ) {}

  generateAccessToken(payload: object): string {
    return this.jwtService.sign(
      { payload },
      { secret: process.env.JWT_SECRET, expiresIn: '1d' },
    ); // 15분 유효기간
  }

  // RefreshToken 생성
  generateRefreshToken(payload: object): string {
    return this.jwtService.sign(
      { payload },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    ); // 7일 유효기간
  }

  verifyToken(token: string): Promise<any> {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      console.log(process.env.JWT_SECRET, token, 'payload직전');
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return payload;
    } catch (err) {
      throw new UnauthorizedException('invalid payload');
    }
  }
  //아직 로그인하기 전,

  // async tokenValidateUser(payload) {
  //   const { email } = payload;
  //   const user: Users = await this.userRepository.findOne({
  //     select: ['id', 'nickname', 'email', 'password'],
  //     where: { email },
  //   });

  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }

  async validateUser(email: string, password: string): Promise<any> {
    //validateUser emial password가 들어오면
    //password를 bcrypt화 해서 보여준다.
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname'],
    });
    //emaill 자체가 존재x

    //비밀번호 일치 확인
    //암호화를하고.
    const hashedPassword = await bcrypt.hash(password, 10);
    //암호화 한거와 저장돼있는 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(user.password, hashedPassword);

    if (!user || !isPasswordValid) {
      return new UnauthorizedException('Invalid password or email');
    }
    //여기서 이메일 인증 + 비밀번호 인증까지 한다.

    return { id: user.id, email: user.email, nickname: user.nickname };
  }
}
