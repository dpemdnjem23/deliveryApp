import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Response } from 'express';

import bcrypt from 'bcrypt';
import { Users } from '../entities/Users.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private authService: AuthService,

    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  //회원가입하기
  async registerUser(
    email: string,
    password: string,
    nickname: string,
  ): Promise<Users> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      nickname,
    });
    return await this.userRepository.save(user);
  }
  async findUserByEmail(email: string): Promise<Users | undefined> {
    console.log(email);
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  //로그인하기 유저를 찾고, jwt 생성, cookie 생성

  async signIn(payload: any, res: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //비밀번호 ,이메일 인증이완료된후, 들어온 데이터들 accesstoken은 내보내고 refresh는 cookie
    const { email, nickname, id } = payload;

    //암호화된 비밀번호가 들어온다.

    //hahspassword 가 된 상태에서, 해석을해서 일치한지 확인.
    const accessToken = this.authService.generateAccessToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // 클라이언트에서 접근 불가
      secure: false, // HTTPS 환경에서만 전송
      sameSite: 'lax', // CSRF 방지
      maxAge: 7 * 24 * 60 * 60 * 1000, // 쿠키 유효기간: 7일
    });
    return res.status(200).json({
      data: {
        id,
        email: email,
        nickname: nickname,
      },
      accessToken: accessToken,
    });
  }
}
