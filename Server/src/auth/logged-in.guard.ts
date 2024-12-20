import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated(); //request.isAuthenticated()는 요청 객체에 연결된 메서드로, 사용자가 인증되었는지 확인합니다.
    //passport.js에서
  }
}
