/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WateringController } from './watering.controller';
import { WateringService } from './watering.service';
import { WateringRecord } from './entities/watering-record.entity';
import { PlantsModule } from '../plants/plants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WateringRecord]),
    PlantsModule,
  ],
  controllers: [WateringController],
  providers: [WateringService],
  exports: [WateringService]
})
export class WateringModule {}
