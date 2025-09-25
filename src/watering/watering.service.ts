import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { WateringRecord } from './entities/watering-record.entity';
import { CreateWateringRecordDto } from './dto/create-watering-record.dto';
import { PlantsService } from '../plants/plants.service';

@Injectable()
export class WateringService {
  constructor(
    @InjectRepository(WateringRecord)
    private readonly wateringRecordRepository: Repository<WateringRecord>,
    private readonly plantsService: PlantsService,
  ) {}

  async recordWatering(
    plantId: number,
    createWateringRecordDto: CreateWateringRecordDto,
    userId: number,
  ): Promise<WateringRecord> {
    // Vérifier que la plante existe
    const plant = await this.plantsService.findOne(plantId, userId);

    const wateringRecord = this.wateringRecordRepository.create({
      plantId,
      amount: createWateringRecordDto.amount,
      notes: createWateringRecordDto.notes,
    });

    const savedRecord = await this.wateringRecordRepository.save(wateringRecord);

    // Mettre à jour la date de dernier arrosage de la plante
    await this.plantsService.updateWateringDate(plantId, savedRecord.wateredAt, userId);

    return savedRecord;
  }

  async getWateringHistory(plantId: number, userId: number): Promise<WateringRecord[]> {
    // Vérifier que la plante existe
    await this.plantsService.findOne(plantId, userId);

    return this.wateringRecordRepository.find({
      where: { plantId },
      order: { wateredAt: 'DESC' },
    });
  }

  async getWateringRecord(plantId: number, recordId: number, userId: number): Promise<WateringRecord> {
    // Vérifier que la plante existe
    await this.plantsService.findOne(plantId, userId);

    const record = await this.wateringRecordRepository.findOne({
      where: { id: recordId, plantId },
    });

    if (!record) {
      throw new NotFoundException(`Watering record with ID ${recordId} not found for plant ${plantId}`);
    }

    return record;
  }

  async getAllWateringRecords(): Promise<WateringRecord[]> {
    return this.wateringRecordRepository.find({
      relations: ['plant'],
      order: { wateredAt: 'DESC' },
    });
  }

  async getRecentWateringRecords(days: number = 7): Promise<WateringRecord[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.wateringRecordRepository.find({
      where: {
        wateredAt: MoreThanOrEqual(date),
      },
      relations: ['plant'],
      order: { wateredAt: 'DESC' },
    });
  }
}