import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import bcrypt from 'bcrypt';
import { Users } from '../entities/Users.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/dto/jwt-payload.interface';
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

  //로그인하기 유저를 찾고, jwt 생성하고 내보낸다.

  async signIn(payload: any) {
    const { email } = payload;
    const user = await this.userRepository.findOne({
      select: ['email', 'nickname', 'password'],
      where: { email },
    });
    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (user && hashedPassword) {
      const payload: JwtPayload = { email };
      const accessToken = this.authService.generateAccessToken(payload);

      return {
        data: {
          email: user.email,
          nickname: user.nickname,
        },
        accessToken: accessToken,
      };
    }
  }
}
