import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import bcrypt from 'bcrypt';
import { Users } from '../entities/Users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  //회원가입하기
  async registerUser(
    email: string,
    password: string,
    nickname: string,
  ): Promise<Users> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      nickname,
    });
    return await this.usersRepository.save(user);
  }
  async findUserByEmail(email: string): Promise<Users | undefined> {
    console.log(email);
    return await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  //로그인하기
}
