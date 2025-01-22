import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

//기본 인증만하는경우는 {} 공백으로둬도되지만,
//인중후 추가작업들이 들어가는경우는  canActivate이후로 추가로 들어가줘야한다.
//로그인후

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private authService: AuthService) {
    super();
  }
  //guard에서 validate로 인증하기 인증이 끝나면 controller에서 auth

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    console.log('authguard', user);
    if (!user) {
      throw new UnauthorizedException(); // 인증 실패
    }
    return user; // 성공 시 사용자 객체 반환
  }
}
