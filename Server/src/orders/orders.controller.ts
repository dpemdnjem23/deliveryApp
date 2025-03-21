import {
  Controller,
  UseInterceptors,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from 'src/interceptors/undefinedToNull.interceptor';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { Order } from 'src/common/decorators/order.decorator';
import { acceptRequestDto } from './dto/order.request.dto';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('ORDER')
@Controller('api/orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @ApiOperation({ summary: '오더 받기' })
  @UseGuards(JwtAuthGuard)
  @Post('accept')
  async accept(@Order() req: acceptRequestDto) {
    return this.orderService.acceptOrders(req);
  }
}
