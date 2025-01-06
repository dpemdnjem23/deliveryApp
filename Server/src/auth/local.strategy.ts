import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log(email, password, '이메일 패스워드0');

    const user = await this.authService.validateUser(email, password);

    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    console.log(user, 'user,sdjfoisajfioeiof');

    if (!user) {
      console.error('사용자 찾을 수 없음:');
      return null;
    }
    console.log('인증성고');
    return user;
  }
}
