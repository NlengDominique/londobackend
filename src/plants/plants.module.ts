/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsService } from './plants.service';
import { PlantsController } from './plants.controller';
import { Plant } from './entities/plant.entity';
import { PlantCalculationService } from './services/plant-calculation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant])
  ],
  controllers: [PlantsController],
  providers: [PlantsService, PlantCalculationService],
  exports: [PlantsService],
})
export class PlantsModule {}
