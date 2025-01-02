import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Users } from '../../entities/Users.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    console.log('왜 실행이안되는것인가에 대하느이문');
    const usersRepository = dataSource.getRepository(Users);
    console.log('Seeding Users completed'); // 디버깅용 로그

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
