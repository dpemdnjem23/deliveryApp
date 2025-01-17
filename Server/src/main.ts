import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.use(cookieParser()); // 쿠키 파서 미들웨어 추가

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
