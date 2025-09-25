import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WateringService } from './watering.service';
import { WateringController } from './watering.controller';
import { WateringRecord } from './entities/watering-record.entity';
import { PlantsModule } from '../plants/plants.module';

@Module({
  imports: [TypeOrmModule.forFeature([WateringRecord]), PlantsModule],
  controllers: [WateringController],
  providers: [WateringService],
  exports: [WateringService],
})
export class WateringModule {}