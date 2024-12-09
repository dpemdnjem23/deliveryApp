import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { AuthService } from './auth.service';

import { LocalStrategy } from './local.strategy';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [AuthService, LocalStrategy],
  exports: [TypeOrmModule],
})
export class AuthModule {}
