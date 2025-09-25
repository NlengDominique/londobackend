/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Plant } from '../plants/entities/plant.entity';
import { User } from '../auth/entities/user.entity';
import { WateringRecord } from 'src/watering/entities/watering-record.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: 'data/plant-manager.db',
  entities: [User, Plant,WateringRecord],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});
