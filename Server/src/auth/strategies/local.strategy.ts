import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }
  //여기서 인증 절차를 거쳐야한다.
  async validate(email: string, password: string): Promise<any> {
    console.log(email, password, '이메일 패스워드0');

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    // console.log(user, 'user,sdjfoisajfioeiof');
    return user;
  }
}
