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

    //refreshtoken인경우

    this.authService.verifyRefreshToken(token);

    return user; // request.user에 저장될 데이터
  }
}
