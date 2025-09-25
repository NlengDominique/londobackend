import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plant } from '../../plants/entities/plant.entity';

export enum NotificationType {
  WATERING_DUE = 'watering_due',
  WATERING_OVERDUE = 'watering_overdue',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  READ = 'read',
  DISMISSED = 'dismissed',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  plantId: number;

  @ManyToOne(() => Plant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plantId' })
  plant: Plant;

  @Column({
    type: 'text',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'text',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({ type: 'datetime', nullable: true })
  scheduledFor: Date;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date;

  @Column({ type: 'datetime', nullable: true })
  readAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}