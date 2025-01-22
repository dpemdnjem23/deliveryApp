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
    const user = await this.authService.validateUser(email, password);
    console.log('localstartegy인증성공', user);

    if (!user) {
      console.log('왜여기가');
      throw new UnauthorizedException();
    }
    // console.log(user, 'user,sdjfoisajfioeiof');
    return user;
  }
}
