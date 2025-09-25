/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional,  Min } from 'class-validator';

export class CreateWateringRecordDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  waterAmount?: number;
}
