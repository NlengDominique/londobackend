/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Plant } from '../plants/entities/plant.entity';
import { EmailService } from './email.service';

@Injectable()
export class WateringReminderService {
  private readonly logger = new Logger(WateringReminderService.name);

  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendWateringReminders() {
    this.logger.debug('Vérification des plantes pour les rappels d\'arrosage...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const plantsNeedingWater = await this.plantRepository.find({
      where: {
        nextWateringDate: LessThanOrEqual(today),
      },
      relations: ['user'],
    });

    for (const plant of plantsNeedingWater) {
      if (!plant.user?.email) continue;

      try {
        await this.emailService.sendWateringReminder(
          plant.user.email,
          plant.name,
          plant.waterAmount
        );
      } catch (error) {
        this.logger.error(`Erreur lors de l'envoi du rappel d'arrosage pour la plante ${plant.id}:`, error);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_5PM)
  async sendMissedWateringReminders() {
    this.logger.debug('Vérification des plantes pour les rappels d\'arrosage manqués...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const missedPlants = await this.plantRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.user', 'user')
      .leftJoinAndSelect('plant.wateringRecords', 'records', 'records.wateredAt >= :yesterday', { yesterday })
      .where('plant.nextWateringDate <= :yesterday', { yesterday })
      .andWhere('records.id IS NULL')
      .getMany();

    for (const plant of missedPlants) {
      if (!plant.user?.email) continue;

      try {
        await this.emailService.sendMissedWateringReminder(
          plant.user.email,
          plant.name,
          plant.waterAmount
        );
      } catch (error) {
        this.logger.error(`Erreur lors de l'envoi du rappel d'arrosage manqué pour la plante ${plant.id}:`, error);
      }
    }
  }
}
