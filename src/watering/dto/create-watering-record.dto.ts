import { IsNumber, IsPositive, IsOptional, IsString, Min } from 'class-validator';

export class CreateWateringRecordDto {
  @IsNumber()
  @IsPositive()
  @Min(10) // Minimum 10ml
  amount: number;

  @IsString()
  @IsOptional()
  notes?: string;
}