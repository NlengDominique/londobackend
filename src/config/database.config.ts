import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Plant } from '../plants/entities/plant.entity';
import { WateringRecord } from '../watering/entities/watering-record.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { User } from '../auth/entities/user.entity';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: 'data/plant-manager.db',
  entities: [User, Plant, WateringRecord, Notification],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});
