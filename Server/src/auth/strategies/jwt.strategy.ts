import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export interface Payload {
  id: number;
  //role:string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // .env 파일 사용 가능
    });
  }

  //토큰을 생성, 검증
  // async validate(payload: JwtPayload): Promise<any> {
  //   const user = await this.authService.tokenValidateUser(payload);
  //   if (!user) {
  //     return new UnauthorizedException({ message: 'user does not exist' });
  //   }

  //   return { email: user.email, nickname: user.nickname };
  // }
}
