import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { blacklistedTokens } from 'src/users/users.service';

@Injectable()
export class JwtBlacklistGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['accessToken']; // 쿠키에서 accessToken 가져오기

    if (!token) throw new UnauthorizedException('로그인이 필요합니다.');
    if (blacklistedTokens.has(token))
      throw new UnauthorizedException('이미 로그아웃된 토큰입니다.');

    return true;
  }
}
