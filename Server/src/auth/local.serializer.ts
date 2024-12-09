import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { Users } from 'src/entities/Users.entity';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly AuthService: AuthService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super();
  }

  serializeUser(user: Users, done: CallableFunction) {
    console.log(user);
    done(null, user.id);
  }
  async deserializeUser(userId: string, done: CallableFunction) {
    return await this.usersRepository
      .findOneOrFail({
        where: { id: +userId },
        select: ['id', 'nickname', 'email'],
      })
      .then((user) => {
        console.log('user', user);
        done(null, user);
      })
      .catch((error) => {
        done(error);
      });
  }
}
