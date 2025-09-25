/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WateringRecord } from './entities/watering-record.entity';
import { CreateWateringRecordDto } from './dto/create-watering-record.dto';
import { PlantsService } from '../plants/plants.service';
import { IWateringService } from './interfaces/watering.interface';

@Injectable()
export class WateringService implements IWateringService {
  constructor(
    @InjectRepository(WateringRecord)
    private readonly wateringRepository: Repository<WateringRecord>,
    private readonly plantsService: PlantsService,
  ) {}

  async findAllUserWateringRecords(
    userId: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<WateringRecord[]> {
    const query = this.wateringRepository
      .createQueryBuilder('watering')
      .leftJoinAndSelect('watering.plant', 'plant')
      .where('watering.userId = :userId', { userId })
      .orderBy('watering.wateredAt', 'DESC');

    if (startDate) {
      query.andWhere('watering.wateredAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('watering.wateredAt <= :endDate', { endDate });
    }

    return query.getMany();
  }

  async create(
    plantId: number,
    userId: number,
    createWateringRecordDto: CreateWateringRecordDto,
  ): Promise<WateringRecord> {
   
    const plant = await this.plantsService.findOne(plantId, userId);

    const wateringRecord = this.wateringRepository.create({
      ...createWateringRecordDto,
      waterAmount: createWateringRecordDto.waterAmount ?? plant.waterAmount,
      plantId,
      userId,
      wateredAt: new Date(),
    });

    const savedRecord = await this.wateringRepository.save(wateringRecord);

    await this.plantsService.updateWateringDate(plantId, wateringRecord.wateredAt, userId);

    return savedRecord;
  }

  async findAll(plantId: number, userId: number): Promise<WateringRecord[]> {
   
    await this.plantsService.findOne(plantId, userId);

    return this.wateringRepository.find({
      where: { plantId, userId },
      order: { wateredAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<WateringRecord> {
    const wateringRecord = await this.wateringRepository.findOne({
      where: { id, userId },
      relations: ['plant'],
    });

    if (!wateringRecord) {
      throw new NotFoundException(`Watering record with ID ${id} not found`);
    }

    return wateringRecord;
  }
}
