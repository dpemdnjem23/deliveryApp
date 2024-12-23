import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config(); // 또는 ConfigModule.forRoot() 호출

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [__dirname + 'src/**/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/migrations/*.ts'],
  seeds: ['src/databases/seeds/**/*.ts'], // 시드 파일 경로
  synchronize: true,
} as DataSourceOptions & SeederOptions);
export default dataSource;
