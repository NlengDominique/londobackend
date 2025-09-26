/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  Req,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { WateringService } from './watering.service';
import { CreateWateringRecordDto } from './dto/create-watering-record.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { WateringRecord } from './entities/watering-record.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Arrosage')
@ApiBearerAuth()
@Controller('watering')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  @Get('all')
  @ApiOperation({ summary: 'Récupérer tous les enregistrements d’arrosage de l’utilisateur connecté' })
@ApiResponse({
  status: 200,
  description: 'Liste des enregistrements récupérée avec succès',
  type: [WateringRecord],
})
@ApiQuery({
  name: 'startDate',
  required: false,
  description: 'Filtrer les enregistrements à partir de cette date)',
  type: String,
})
@ApiQuery({
  name: 'endDate',
  required: false,
  description: 'Filtrer les enregistrements jusqu’à cette date',
  type: String,
})
  @HttpCode(HttpStatus.OK)
  async findAllUserWateringRecords(
    @Req() req: { user: { id: number } },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<WateringRecord[]> {
    return this.wateringService.findAllUserWateringRecords(
      req.user.id,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post('plants/:plantId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouvel enregistrement d\'arrosage' })
  @ApiResponse({
    status: 201,
    description: 'Enregistrement d\'arrosage créé avec succès',
    type: WateringRecord
  })
  @ApiParam({
    name: 'plantId',
    description: 'ID de la plante',
    type: Number,
    required: true
  })
  create(
    @Param('plantId', ParseIntPipe) plantId: number,
    @Body(ValidationPipe) createWateringRecordDto: CreateWateringRecordDto,
    @Req() req: { user: { id: number } },
  ): Promise<WateringRecord> {
    return this.wateringService.create(plantId, req.user.id, createWateringRecordDto);
  }

  @Get('plants/:plantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Récupérer tous les enregistrements d\'arrosage d\'une plante' })
  @ApiResponse({
    status: 200,
    description: 'Liste des enregistrements d\'arrosage récupérée avec succès',
    type: [WateringRecord]
  })
  @ApiParam({
    name: 'plantId',
    description: 'ID de la plante',
    type: Number,
    required: true
  })
  findAll(
    @Param('plantId', ParseIntPipe) plantId: number,
    @Req() req: { user: { id: number } },
  ): Promise<WateringRecord[]> {
    return this.wateringService.findAll(plantId, req.user.id);
  }
}
