import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClearCookie = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    console.log('clear cookie', response);
    response.clearCookie(data);
  },
);
