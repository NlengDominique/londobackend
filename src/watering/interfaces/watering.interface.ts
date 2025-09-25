/* eslint-disable prettier/prettier */
import { WateringRecord } from '../entities/watering-record.entity';
import { CreateWateringRecordDto } from '../dto/create-watering-record.dto';

export interface IWateringService {
  findAll(plantId: number, userId: number): Promise<WateringRecord[]>;
  findOne(id: number, userId: number): Promise<WateringRecord>;
  findAllUserWateringRecords(userId: number, startDate?: Date, endDate?: Date): Promise<WateringRecord[]>;
  create(plantId: number, userId: number, createWateringRecordDto: CreateWateringRecordDto): Promise<WateringRecord>;
}
