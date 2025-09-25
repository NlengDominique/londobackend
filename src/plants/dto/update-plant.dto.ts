/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantDto } from './create-plant.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePlantDto extends PartialType(CreatePlantDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}