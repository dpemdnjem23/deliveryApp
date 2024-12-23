import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { Users } from 'src/entities/Users.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const usersRepository = dataSource.getRepository(Users);
    await usersRepository.insert([
      {
        id: 1,
        nickname: 'Sleact',
        password: 'dkskqkek!23',
        email: 'dkskqkek123@naver.com',
      },
    ]);
  }
}
