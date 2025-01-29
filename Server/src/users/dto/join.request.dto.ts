import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class JoinRequestDto {
  @IsEmail()
  @ApiProperty({
    example: 'email23@gmail.com',
    description: '이메일',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '누구',
    description: '닉네임',
  })
  public nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'enfnandtnf!23',
    description: 'qlalfqjsgh',
  })
  public password: string;
}
