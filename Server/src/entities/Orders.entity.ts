import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users.entity';

// @Index('email', ['email'], { unique: true })
@Entity({
  name: 'orders',
  schema: 'delivery',
})
export class Orders {
  @PrimaryColumn({ name: 'orderId' }) // 자동 생성 X, 직접 설정해야 함
  orderId: string;

  @Column('simple-json', { name: 'start' })
  start: {
    latitude: number;
    longitude: number;
  };

  @Column('simple-json', { name: 'end' })
  end: {
    latitude: number;
    longitude: number;
  };

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //한명당 한개의 주문만
  @OneToOne(() => Users, (user) => user.id)
  @JoinColumn() // ✅ UserProfile 테이블에 외래키 생성
  user: Users;
}
