import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { AuthService } from './auth.service';

import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.EXPO_PUBLIC_JWT_SECRET,
      signOptions: {
        expiresIn: '15m',
      },
    }),
  ],
  providers: [JwtStrategy, AuthService, LocalStrategy],
  exports: [TypeOrmModule, JwtModule, AuthService, JwtStrategy],
})
export class AuthModule {}
