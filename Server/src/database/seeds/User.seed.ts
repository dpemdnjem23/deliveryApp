import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Users } from '../../entities/Users.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const usersRepository = dataSource.getRepository(Users);

    await usersRepository.insert([
      {
        id: 1,
        nickname: 'Sle',
        password: 'dkskqkek!23',
        email: 'dkskqkek123@naver.com',
      },
    ]);
  }
}
