import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super();
  }

  handleRequest(err, user, info, context) {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    const [, token] = authHeader.split(' ');
    console.log(token, 'jwt auth guard token');

    //accessToken인경우
    this.authService.verifyToken(token);
    //refreshtoken인경우
    //여기는 인가다. 맞으면 user를 내보내고 틀리면 빠꾸

    return user; // request.user에 저장될 데이터
  }
}
