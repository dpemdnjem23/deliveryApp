import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // canActivate 메서드를 오버라이드하여 토큰 검증 과정을 커스터마이즈
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('JWT token is missing');
    }

    // JWT 토큰 검증 로직 (필요에 따라 직접 토큰을 검증하거나, Passport의 검증을 사용)
    try {
      // 예시로 JWT를 수동으로 검증 (참고: `jwtService.verify`와 같은 서비스 사용)
      // this.jwtService.verify(token);

      // 기본적으로 AuthGuard('jwt')의 기능이 실행되도록
      return super.canActivate(context);
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
