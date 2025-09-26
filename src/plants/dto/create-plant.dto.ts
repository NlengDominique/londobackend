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
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantDto {
  @ApiProperty({
    example: 'Monstera Deliciosa',
    description: 'Nom de la plante',
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Araceae',
    description: 'Espèce de la plante',
    maxLength: 255,
    required: false
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  species?: string;

  @ApiProperty({
    example: 'https://example.com/plant-image.jpg',
    description: 'URL de l\'image de la plante',
    maxLength: 500,
    required: false
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({
    example: '2023-09-25',
    description: 'Date d\'achat de la plante)'
  })
  @IsDateString()
  purchaseDate: string;

  @ApiProperty({
    example: 200,
    description: 'Quantité d\'eau nécessaire en millilitres',
    minimum: 50
  })
  @IsNumber()
  @IsPositive()
  @Min(50) 
  waterAmount: number;

  @ApiProperty({
    example: 7,
    description: 'Fréquence d\'arrosage en jours',
    minimum: 1
  })
  @IsNumber()
  @IsPositive()
  @Min(1) 
  wateringFrequency: number;
}