/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plant } from '../../plants/entities/plant.entity';
import { Exclude } from 'class-transformer';

@Entity('watering_records')
export class WateringRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  plantId: number;

  @Exclude()
  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => Plant, (plant) => plant.wateringRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plantId' })
  plant: Plant;

  @Column({ type: 'datetime' })
  wateredAt: Date;

  @Column({ type: 'integer' })
  waterAmount: number;

  @CreateDateColumn()
  createdAt: Date;
}
