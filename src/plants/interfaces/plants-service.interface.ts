/* eslint-disable prettier/prettier */
import { Plant } from '../entities/plant.entity';
import { CreatePlantDto } from '../dto/create-plant.dto';

export interface IPlantsService {
  create(createPlantDto: CreatePlantDto, userId: number): Promise<Plant>;
  findAll(userId: number): Promise<Plant[]>;
  findOne(id: number, userId: number): Promise<Plant>;
}
