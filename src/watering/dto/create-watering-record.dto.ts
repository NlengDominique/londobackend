/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWateringRecordDto {
  @ApiProperty({
    description: 'La quantité d\'eau utilisée pour l\'arrosage en millilitres',
    example: 200,
    required: false,
    minimum: 1,
    type: Number
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  waterAmount?: number;
}
