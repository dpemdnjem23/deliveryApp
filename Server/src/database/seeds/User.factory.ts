import { Users } from 'src/entities/Users.entity';
import { setSeederFactory } from 'typeorm-extension';

import { Faker } from '@faker-js/faker';
export const UsersFactory = setSeederFactory(Users, (faker) => {
  const user = new Users();

  user.id = 1;
  user.nickname = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = 'dkskqkek123';

  return user;
});
