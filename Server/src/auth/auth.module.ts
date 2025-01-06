import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { AuthService } from './auth.service';

import { LocalStrategy } from './local.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [TypeOrmModule.forFeature([Users]), PassportModule],
  providers: [AuthService, LocalStrategy],
  exports: [TypeOrmModule],
})
export class AuthModule {}
