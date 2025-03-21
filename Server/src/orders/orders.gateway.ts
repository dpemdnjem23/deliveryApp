import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { OrdersService } from './orders.service';
import shortid from 'shortid';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow requests from all origins
    credentials: true,
  },
})
export class OrdersGateway {
  @WebSocketServer()
  private orderInterval: any; // 🔥 주문을 지속적으로 생성하는 Interval

  private server: Server;
  constructor(private readonly ordersService: OrdersService) {}

  // Event listener for a custom event 'orderCreated'
  @SubscribeMessage('acceptOrder')
  handleMessage(
    @MessageBody() data: any, // 클라이언트로부터 받은 데이터
    @ConnectedSocket() client: Socket, // 연결된 클라이언트 정보
  ): void {
    const socketId = client.id;

    // Logic for handling the new order data
    // this.ordersService.createOrder(data);

    if (this.orderInterval) {
      clearInterval(this.orderInterval);
    }

    console.log('시작하는곳');
    //그럼여기에 만들어진 orderData를 넣는다.
    let count = 0;
    this.orderInterval = setInterval(() => {
      console.log('socket이 지속적으로 데이터를 보내줍니다....');

      if (count >= 10) {
        clearInterval(this.orderInterval);
      }
      const order = {
        orderId: shortid(),
        start: {
          latitude: Math.floor(Math.random() * 200) * 0.001 + 37.4,
          longitude: Math.floor(Math.random() * 300) * 0.001 + 126.8,
        },
        end: {
          latitude: Math.floor(Math.random() * 200) * 0.001 + 37.4,
          longitude: Math.floor(Math.random() * 300) * 0.001 + 126.8,
        },
        price: Math.floor(Math.random() * 6) * 1000 + 6000,

        rider: Math.random() > 0.5 ? shortid() : undefined,
      };

      this.ordersService.addOrdersData(order);

      this.server.emit('order', order);
      count = count + 1;
    }, 10_000);
  }

  // Emit an event back to all clients with the new order

  // Optionally handle client connection events
  handleConnection(client: Socket, ...args: any[]): void {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket): void {
    console.log('Client disconnected:', client.id);

    clearInterval(this.orderInterval);
  }

  // You can also access the socket server directly

  // Allow access to the socket server instance
  afterInit(server: Server) {
    // console.log(server, 'afterinit');
    this.server = server;
  }
}
