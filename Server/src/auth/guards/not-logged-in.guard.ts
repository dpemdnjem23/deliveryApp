import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
//http요청 컨텍스트로 전환하여 http 전용 데이터를 가져온다.
//http 요청 객체를 반환한다.
//고로 Authorization 헤더가 포함된 요청만 컨트롤러로 전달하며 그렇지 않으면 요청을 차단한다.
//즉 인증된것만 들어올수 있도록한다.
//회원탈퇴는 로그인한경우에만 허용하도록 하자.
@Injectable()
export class NotLoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return !request.user;
  }
}
