import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';

export const GetBearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization']; // Authorization 헤더에서 Bearer 토큰 추
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [, token] = authHeader.split(' '); // 'Bearer <token>'에서 <token>만 추출

    return token; // 추출한 토큰 반환
  },
);
