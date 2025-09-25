import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity';
import { Plant } from '../plants/entities/plant.entity';
import { PlantsModule } from '../plants/plants.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Plant]), PlantsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}