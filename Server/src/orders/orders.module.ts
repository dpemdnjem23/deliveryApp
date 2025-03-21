import { Module } from '@nestjs/common';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthService } from 'src/auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users.entity';
import { Orders } from 'src/entities/Orders.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Orders])],
  providers: [OrdersGateway, AuthService, JwtService, OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
