import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WateringService } from './watering.service';
import { CreateWateringRecordDto } from './dto/create-watering-record.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  @Post('plants/:plantId/watering')
  @HttpCode(HttpStatus.CREATED)
  recordWatering(
    @Param('plantId', ParseIntPipe) plantId: number,
    @Body(ValidationPipe) createWateringRecordDto: CreateWateringRecordDto,
    @Request() req,
  ) {
    return this.wateringService.recordWatering(plantId, createWateringRecordDto, req.user.id);
  }

  @Get('plants/:plantId/watering')
  getWateringHistory(@Param('plantId', ParseIntPipe) plantId: number, @Request() req) {
    return this.wateringService.getWateringHistory(plantId, req.user.id);
  }

  @Get('plants/:plantId/watering/:recordId')
  getWateringRecord(
    @Param('plantId', ParseIntPipe) plantId: number,
    @Param('recordId', ParseIntPipe) recordId: number,
    @Request() req,
  ) {
    return this.wateringService.getWateringRecord(plantId, recordId, req.user.id);
  }

  @Get('watering')
  getAllWateringRecords(@Query('days', ParseIntPipe) days?: number) {
    if (days) {
      return this.wateringService.getRecentWateringRecords(days);
    }
    return this.wateringService.getAllWateringRecords();
  }
}