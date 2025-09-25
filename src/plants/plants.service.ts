import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
  ) {}

  async create(createPlantDto: CreatePlantDto, userId: number): Promise<Plant> {
    const plant = this.plantRepository.create({
      ...createPlantDto,
      userId,
      purchaseDate: new Date(createPlantDto.purchaseDate),
    });

    // Calculer la prochaine date d'arrosage basée sur la date d'achat
    plant.nextWateringDate = this.calculateNextWateringDate(
      plant.purchaseDate,
      plant.wateringFrequency,
    );

    return this.plantRepository.save(plant);
  }

  async findAll(userId: number): Promise<Plant[]> {
    return this.plantRepository.find({
      where: { isActive: true, userId },
      relations: ['wateringRecords'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Plant> {
    const plant = await this.plantRepository.findOne({
      where: { id, isActive: true, userId },
      relations: ['wateringRecords'],
    });

    if (!plant) {
      throw new NotFoundException(`Plant with ID ${id} not found`);
    }

    return plant;
  }

  async update(id: number, updatePlantDto: UpdatePlantDto, userId: number): Promise<Plant> {
    const plant = await this.findOne(id, userId);

    const updatedPlant = { ...plant, ...updatePlantDto };

    if (updatePlantDto.purchaseDate) {
      updatedPlant.purchaseDate = new Date(updatePlantDto.purchaseDate);
    }

    // Recalculer la prochaine date d'arrosage si la fréquence a changé
    if (updatePlantDto.wateringFrequency && plant.lastWateredAt) {
      updatedPlant.nextWateringDate = this.calculateNextWateringDate(
        plant.lastWateredAt,
        updatePlantDto.wateringFrequency,
      );
    }

    await this.plantRepository.update(id, updatedPlant);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const plant = await this.findOne(id, userId);
    await this.plantRepository.update(id, { isActive: false });
  }

  async getPlantsNeedingWater(userId: number): Promise<Plant[]> {
    const plants = await this.findAll(userId);
    return plants.filter((plant) => plant.needsWatering());
  }

  async updateWateringDate(plantId: number, wateredAt: Date, userId: number): Promise<Plant> {
    const plant = await this.findOne(plantId, userId);
    
    plant.lastWateredAt = wateredAt;
    plant.nextWateringDate = this.calculateNextWateringDate(
      wateredAt,
      plant.wateringFrequency,
    );

    await this.plantRepository.save(plant);
    return plant;
  }

  private calculateNextWateringDate(lastDate: Date, frequency: number): Date {
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + frequency);
    return nextDate;
  }
}