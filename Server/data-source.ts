import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config(); // 또는 ConfigModule.forRoot() 호출

const configService = new ConfigService();

console.log(
  'Entities Path:',
  join(__dirname, './src/entities/*.entity.{ts,js}'),
);
console.log(
  'Seeds Path:',
  join(__dirname, './src/database/seeds/*.seed.{ts,js}'),
);
const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  // entities: [Users],
  // entities: ['src/entities/*.entity.{js,ts}'],

  // entities: [__dirname + '/src/entities/*.entity.{ts,js}'],

  entities: [join(__dirname, './src/entities/*.entity.{ts,js}')],
  schema: 'delivery',
  migrations: [join(__dirname, './src/migrations/*.ts')],

  seeds: [join(__dirname, './src/database/seeds/*.seed.{ts,js}')],
  // seeds: [__dirname + '/src/database/seeds/User.seed.{js,ts}'],
  synchronize: true,
  logging: true,
} as DataSourceOptions & SeederOptions);

export default dataSource;
