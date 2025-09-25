/* eslint-disable prettier/prettier */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsPositive,
  MaxLength,
  Min,
  IsUrl,
} from 'class-validator';

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  species?: string;


  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @IsDateString()
  purchaseDate: string;

  //besoin en eau
  @IsNumber()
  @IsPositive()
  @Min(50) 
  waterAmount: number;

  @IsNumber()
  @IsPositive()
  @Min(1) 
  wateringFrequency: number;
}