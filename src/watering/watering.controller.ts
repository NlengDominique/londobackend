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

@Controller('watering')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  @Get('all')

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
  create(
    @Param('plantId', ParseIntPipe) plantId: number,
    @Body(ValidationPipe) createWateringRecordDto: CreateWateringRecordDto,
    @Req() req: { user: { id: number } },
  ): Promise<WateringRecord> {
    return this.wateringService.create(plantId, req.user.id, createWateringRecordDto);
  }

  @Get('plants/:plantId')
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('plantId', ParseIntPipe) plantId: number,
    @Req() req: { user: { id: number } },
  ): Promise<WateringRecord[]> {
    return this.wateringService.findAll(plantId, req.user.id);
  }
}
