import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Orders } from 'src/entities/Orders.entity';
import { Users } from 'src/entities/Users.entity';
import { Repository } from 'typeorm';
import shortid from 'shortid';
import { OrdersGateway } from './orders.gateway';
import { async } from '../../../node_modules/es-module-lexer/lexer';

@Injectable()
export class OrdersService {
  private orders = [];

  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(Orders)
    private orderRepository: Repository<Orders>,

    private authService: AuthService,
  ) {}

  //orders 가 완료된경우
  async complete(req): Promise<void> {
    const order = this.orders.find(
      (v) => v.orderId === req.body.orderId && v.rider === req.body.email,
    );
    if (!order) {
      throw new BadRequestException('유효하지않은 주문');
    }
    order.completedAt = new Date();
  } //orders를 수락
  async acceptOrders(req): Promise<void> {
    const orders = this.orders;
    console.log(orders);

    const order = orders.find((v) => v.orderId === req.body.orderId);

    if (!order) {
      throw new BadRequestException('유효하지않은 주문');
    } else if (order.rider) {
      throw new BadRequestException('이미 수락한 주문');
    }
    console.log(orders);

    throw new HttpException('주문 수락!', HttpStatus.OK);
  }

  // orders를 거절

  //orders 데이터들 즉, 주문을 넣는다.
  addOrdersData(data) {
    this.orders.push(data);
  }
}
