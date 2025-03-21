import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class Coordinates {
  @IsNumber()
  @ApiProperty({ example: 123, description: '위도' })
  latitude: number;

  @IsNumber()
  @ApiProperty({ example: 142.2, description: '경도' })
  longitude: number;
}

export class acceptRequestDto {
  @IsString()
  @ApiProperty({
    example: 'zsw5285',
    description: '주문번호',
  })
  public orderId: string;

  @IsObject()
  @Type(() => Coordinates) // 객체 검증을 위해 `@Type` 사용
  @ApiProperty({
    example: {
      latitude: 123,
      longitude: 142.2,
    },
    description: '좌표',
    type: Coordinates,
  })
  public start: Coordinates;

  @IsObject()
  @Type(() => Coordinates)
  @ApiProperty({
    example: {
      latitude: 123,
      longitude: 123.4,
    },
    description: '좌표',
    type: Coordinates,
  })
  public end: Coordinates;

  @IsNumber()
  @ApiProperty({ example: 7000, description: '배달비' })
  public price: number;

  @IsString()
  @ApiProperty({
    example: 'zsw5285',
    description: '가상의 rider',
  })
  public rider: string;
}

// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     JoinColumn,
//     OneToOne,
//     PrimaryColumn,
//     UpdateDateColumn,
//   } from 'typeorm';
//   import { Users } from './Users.entity';

//   // @Index('email', ['email'], { unique: true })
//   @Entity({
//     name: 'orders',
//     schema: 'delivery',
//   })
//   export class Orders {
//     @PrimaryColumn({ name: 'orderId' }) // 자동 생성 X, 직접 설정해야 함
//     orderId: string;

//     @Column('simple-json', { name: 'start' })
//     start: {
//       latitude: number;
//       longitude: number;
//     };

//     @Column('simple-json', { name: 'end' })
//     end: {
//       latitude: number;
//       longitude: number;
//     };

//     @Column('decimal', { precision: 10, scale: 2 })
//     price: number;

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;

//     //한명당 한개의 주문만
//     @OneToOne(() => Users, (user) => user.id)
//     @JoinColumn() // 테이블에 외래키 생성
//     user: Users;
//   }
