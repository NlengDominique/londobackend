import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification, NotificationType, NotificationStatus } from './entities/notification.entity';
import { PlantsService } from '../plants/plants.service';
import { Plant } from '../plants/entities/plant.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    private readonly plantsService: PlantsService,
  ) {}

  // Exécúté toutes les heures pour vérifier les plantes à arroser
  @Cron(CronExpression.EVERY_HOUR)
  async checkWateringNotifications() {
    this.logger.log('Checking for plants that need watering...');
    
    try {
      // Pour le cron job, nous devons récupérer toutes les plantes de tous les utilisateurs
      // Nous allons utiliser une requête directe au repository
      const plants = await this.findAllPlantsForCron();
      const now = new Date();
      
      for (const plant of plants) {
        if (plant.needsWatering()) {
          const existingNotification = await this.findPendingNotificationForPlant(
            plant.id,
            NotificationType.WATERING_DUE
          );
          
          if (!existingNotification) {
            await this.createWateringNotification(plant);
          }
          
          // Vérifier si la plante est en retard d'arrosage (plus de 24h)
          if (plant.nextWateringDate && 
              now.getTime() - plant.nextWateringDate.getTime() > 24 * 60 * 60 * 1000) {
            const overdueNotification = await this.findPendingNotificationForPlant(
              plant.id,
              NotificationType.WATERING_OVERDUE
            );
            
            if (!overdueNotification) {
              await this.createOverdueNotification(plant);
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error checking watering notifications:', error);
    }
  }

  async createWateringNotification(plant: Plant): Promise<Notification> {
    const notification = this.notificationRepository.create({
      plantId: plant.id,
      type: NotificationType.WATERING_DUE,
      title: `🌱 Temps d'arroser ${plant.name}`,
      message: `Votre plante "${plant.name}" a besoin d'eau ! Quantité recommandée: ${plant.waterAmount}ml`,
      scheduledFor: new Date(),
      status: NotificationStatus.PENDING,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    this.logger.log(`Created watering notification for plant: ${plant.name}`);
    return savedNotification;
  }

  async createOverdueNotification(plant: Plant): Promise<Notification> {
    const daysOverdue = Math.floor(
      (new Date().getTime() - plant.nextWateringDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    const notification = this.notificationRepository.create({
      plantId: plant.id,
      type: NotificationType.WATERING_OVERDUE,
      title: `🚨 ${plant.name} manque d'eau !`,
      message: `Votre plante "${plant.name}" aurait dû être arrosée il y a ${daysOverdue} jour(s). Elle a vraiment besoin d'eau !`,
      scheduledFor: new Date(),
      status: NotificationStatus.PENDING,
    });

    const savedNotification = await this.notificationRepository.save(notification);
    this.logger.log(`Created overdue notification for plant: ${plant.name}`);
    return savedNotification;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({
      relations: ['plant'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { status: NotificationStatus.PENDING },
      relations: ['plant'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<Notification> {
    await this.notificationRepository.update(id, {
      status: NotificationStatus.READ,
      readAt: new Date(),
    });
    
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['plant'],
    });
    
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    
    return notification;
  }

  async markAsDismissed(id: number): Promise<Notification> {
    await this.notificationRepository.update(id, {
      status: NotificationStatus.DISMISSED,
    });
    
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['plant'],
    });
    
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    
    return notification;
  }

  async deleteNotification(id: number): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async clearOldNotifications(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await this.notificationRepository.delete({
      createdAt: LessThanOrEqual(thirtyDaysAgo),
      status: NotificationStatus.DISMISSED,
    });

    this.logger.log('Cleared old dismissed notifications');
  }

  private async findPendingNotificationForPlant(
    plantId: number,
    type: NotificationType
  ): Promise<Notification | null> {
    return this.notificationRepository.findOne({
      where: {
        plantId,
        type,
        status: NotificationStatus.PENDING,
      },
    });
  }

  // Nettoyer les anciennes notifications tous les jours à minuit
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldNotifications() {
    this.logger.log('Cleaning up old notifications...');
    await this.clearOldNotifications();
  }

  // Méthode pour le cron job - récupère toutes les plantes actives
  private async findAllPlantsForCron(): Promise<Plant[]> {
    return this.plantRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });
  }
}