import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Plant } from '../../plants/entities/plant.entity';

@Entity('watering_records')
export class WateringRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  plantId: number;

  @ManyToOne(() => Plant, (plant) => plant.wateringRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plantId' })
  plant: Plant;

  @Column({ type: 'integer' }) // quantité en millilitres
  amount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  wateredAt: Date;
}