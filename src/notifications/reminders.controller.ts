/* eslint-disable prettier/prettier */
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { WateringReminderService } from './watering-reminder.service';
import { ApiTags } from '@nestjs/swagger';


//route pour les rappels d'arrosage
@ApiTags('rappels')
@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly wateringReminderService: WateringReminderService) {}

  @Post('test/watering')
  async testWateringReminders() {
    await this.wateringReminderService.sendWateringReminders();
    return { message: 'Rappels d\'arrosage envoyés' };
  }

  @Post('test/missed')
  async testMissedWateringReminders() {
    await this.wateringReminderService.sendMissedWateringReminders();
    return { message: 'Rappels d\'arrosage manqués envoyés' };
  }
}
