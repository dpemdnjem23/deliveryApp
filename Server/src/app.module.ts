import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as path from 'path';
// import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from './users/users.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<number>('DATABASE_PORT')),
        database: configService.get<string>('DATABASE_NAME'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],

        migrations: [__dirname + '/migrations/*.ts'],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        timezone: 'local',
      }),
    }),
    UsersModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [AppController, OrdersController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    OrdersService,
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {
  async onApplicationBootstrap() {
    try {
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Failed to connect to the database:', error.message);
    }
  }

  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
