/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WateringReminderService } from './watering-reminder.service';
import { EmailService } from './email.service';
import { RemindersController } from './reminders.controller';
import { Plant } from '../plants/entities/plant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant]),
    ConfigModule,
  ],
  controllers: [RemindersController],
  providers: [WateringReminderService, EmailService],
  exports: [WateringReminderService, EmailService],
})
export class NotificationsModule {}
