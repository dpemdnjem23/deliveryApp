/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

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
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
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
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return payload;
    } catch (err) {
      console.error(err);
      //token이 만료된 경우
      if (err.name === 'TokenExpiredError') {
        throw new HttpException(err, 419);
      }
      throw new UnauthorizedException('유효하지 않은액세스 토큰입니다');
    }
  }

  verifyRefreshToken(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      return payload;
    } catch (err) {
      console.error(err);
      //token이 만료된 경우
      if (err.name === 'TokenExpiredError') {
        throw new HttpException(
          { message: 'Session expired', code: 'session_expired' },
          419,
        );
      }
      throw new UnauthorizedException('유효하지 않은 리프레쉬 토큰입니다');
    }
  }
  //아직 로그인하기 전,

  async refreshAccessToken(token: string) {
    // console.log(refreshToken);
    //accessToken을 받아서 검증을 한다. 만약 검증이 실패 한다면 그냥 다시 로그인해라.
    const decode = await this.verifyToken(token); // token 검증

    const user = await this.userRepository.findOne({
      where: { email: decode.payload.email },
      select: ['id', 'email', 'nickname'],
    });
    const accessToken = this.generateAccessToken(user);

    return {
      accessToken: accessToken,
      data: { id: user.id, email: user.email, nickname: user.nickname },
    };

    // const user = this.userService.findUserByEmail(decoded)
  }
  //refreshToken으로 accesstoken 재발급하기 acessToken이 없는경우

  //   async reissueAccessToken(token: string) {
  // //refresh검증후 refresh가 만료됐거나 없는 상태
  //     const decode = await this.verifyToken(token); // refreshToken검증

  //     const user = await this.userRepository.findOne({
  //       where: { email: decode.payload.email },
  //       select: ['id', 'email', 'nickname'],
  //     });
  //     const newAccessToken = this.generateAccessToken(user);

  //     return { accessToken: newAccessToken };
  //   }

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
    console.log(user, 'validateUser');
    //emaill 자체가 존재x

    //비밀번호 일치 확인
    //암호화를하고.
    const hashedPassword = await bcrypt.hash(password, 10);
    //암호화 한거와 저장돼있는 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    console.log(hashedPassword, isPasswordValid, user.password, password);

    if (!user || !isPasswordValid) {
      return new UnauthorizedException('Invalid password or email');
    }
    //여기서 이메일 인증 + 비밀번호 인증까지 한다.

    return { id: user.id, email: user.email, nickname: user.nickname };
  }
}
