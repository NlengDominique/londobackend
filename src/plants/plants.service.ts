/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { IPlantsService } from './interfaces/plants-service.interface';
import { PlantCalculationService } from './services/plant-calculation.service';

@Injectable()
export class PlantsService implements IPlantsService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    private readonly calculationService: PlantCalculationService,
  ) {}

  async create(createPlantDto: CreatePlantDto, userId: number): Promise<Plant> {
    const plant = this.plantRepository.create({
      ...createPlantDto,
      userId,
      purchaseDate: new Date(createPlantDto.purchaseDate),
    });

    plant.nextWateringDate = this.calculateNextWateringDate(
      plant.purchaseDate,
      plant.wateringFrequency,
    );

    return this.plantRepository.save(plant);
  }

  async findAll(userId: number): Promise<Plant[]> {
    return this.plantRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Plant> {
    const plant = await this.plantRepository.findOne({
      where: { id, userId },
    });

    if (!plant) {
      throw new NotFoundException('Plante pas disponible');
    }

     if (plant.userId !== userId) {
    throw new ForbiddenException(
     'Pas autorise a voir cette ressource'
    );
  }

    return plant;
  }

  private calculateNextWateringDate(lastDate: Date, frequency: number): Date {
    return this.calculationService.calculateNextWateringDate(lastDate, frequency);
  }

  async updateWateringDate(plantId: number, wateredAt: Date, userId: number): Promise<Plant> {
    const plant = await this.findOne(plantId, userId);
    
    plant.lastWateredAt = wateredAt;
    plant.nextWateringDate = this.calculateNextWateringDate(
      wateredAt,
      plant.wateringFrequency,
    );

    return this.plantRepository.save(plant);
  }
}