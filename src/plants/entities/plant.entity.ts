/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Exclude } from 'class-transformer';
import { WateringRecord } from '../../watering/entities/watering-record.entity';

@Entity('plants')
@Index(['userId'])
@Index(['nextWateringDate'])
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => User, (user) => user.plants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column({nullable:true})
  species: string;


  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'date' })
  purchaseDate: Date;


  // Besoins en eau
  @Column({ type: 'integer', default: 500 }) 
  waterAmount: number;

  @Column({ type: 'integer', default: 3 }) 
  wateringFrequency: number;

  @Column({ type: 'datetime', nullable: true })
  lastWateredAt: Date;

  @Column({ type: 'datetime', nullable: true })
  nextWateringDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WateringRecord, (wateringRecord) => wateringRecord.plant)
  wateringRecords: WateringRecord[];
}