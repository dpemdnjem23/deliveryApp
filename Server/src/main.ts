import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser'; // ES6 방식 import
import { IoAdapter } from '@nestjs/platform-socket.io';

import { AppModule } from './app.module';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(cookieParser()); // 쿠키 파서 미들웨어 추가
  app.enableCors({
    origin: '*', // 모든 도메인 허용 (프로덕션에서는 특정 도메인만 허용하세요)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // 허용할 HTTP 메서드
    allowedHeaders: 'Content-Type, Authorization', // 허용할 헤더
    credentials: true, // 쿠키 허용 (필요한 경우)
  });
  const config = new DocumentBuilder()
    .setTitle('Delivery')
    .setDescription('The Delivery API description')
    .setVersion('1.0')
    .addTag('Delivery')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
