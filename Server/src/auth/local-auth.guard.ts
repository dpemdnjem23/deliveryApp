import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('Guard 실행 시작');

    const request = context.switchToHttp().getRequest();
    console.log('Request Body:', request.body);
    try {
      const can = await super.canActivate(context);
      console.log(can);
      return true;
      // if (can) {
      //   const request = context.switchToHttp().getRequest();
      //   console.log('login for cookie');
      //   await super.logIn(request);
    } catch (error) {
      console.error('canActivate 에러:', error);
      throw error;
    }
  }
}
