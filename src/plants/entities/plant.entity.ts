/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WateringRecord } from '../../watering/entities/watering-record.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => User, (user) => user.plants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  species: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imageUrl: string;

  @Column({ type: 'date' })
  purchaseDate: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  location: string;

  // Besoins en eau
  @Column({ type: 'integer', default: 500 }) // en millilitres
  waterAmount: number;

  @Column({ type: 'integer', default: 3 }) // en jours
  wateringFrequency: number;

  @Column({ type: 'datetime', nullable: true })
  lastWateredAt: Date;

  @Column({ type: 'datetime', nullable: true })
  nextWateringDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => WateringRecord, (wateringRecord) => wateringRecord.plant)
  wateringRecords: WateringRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthode utilitaire pour calculer la prochaine date d'arrosage
  calculateNextWateringDate(): Date {
    if (!this.lastWateredAt) {
      return new Date();
    }
    const nextDate = new Date(this.lastWateredAt);
    nextDate.setDate(nextDate.getDate() + this.wateringFrequency);
    return nextDate;
  }

  // Méthode pour vérifier si la plante a besoin d'eau
  needsWatering(): boolean {
    if (!this.nextWateringDate) {
      return true;
    }
    return new Date() >= this.nextWateringDate;
  }
}