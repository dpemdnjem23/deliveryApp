import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Orders } from './Orders.entity';

// @Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
  schema: 'delivery',
})
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  @Column(`varchar`, { name: 'email', length: 30, unique: true })
  email: string;

  @Column('varchar', { name: 'password', length: 100, select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Orders, (order) => order.user) // specify inverse side as a second parameter
  order: Orders;
}
