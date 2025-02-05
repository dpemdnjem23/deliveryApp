import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }
  //여기서 인증 절차를 거쳐야한다.
  async validate(email: string, password: string): Promise<any> {
    console.log(email, password, 'localstrategy');
    const user = await this.authService.validateUser(email, password);

    console.log(user, 'localstrategy user');
    if (!user) {
      throw new UnauthorizedException('user expired');
    }
    // console.log(user, 'user,sdjfoisajfioeiof');
    return user;
  }
}
