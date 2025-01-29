import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname'],
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

    return {
      data: {
        id,
        email: email,
        nickname: nickname,
      },
      accessToken: accessToken,
    };
  }
  //유저 아이디 변경

  // 회원탈퇴
  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'nickname'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(id);

    await this.userRepository.delete(id);

    // await this.cleanUpUserData(id);
  }
}
