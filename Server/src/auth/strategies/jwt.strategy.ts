import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // .env 파일 사용 가능
    });
  }

  //검증된 토큰을 자동으로 payload로 반환해준다.
  async validate(payload: any) {
    // console.log(token, 'jwtpayload');
    return payload;
    // const verfiy = this.authService.verifyRefreshToken(payload);
    // return { payload };
  }
}
