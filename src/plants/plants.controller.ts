/* eslint-disable prettier/prettier */
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
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,

} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { Plant } from './entities/plant.entity';

@Controller('plants')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(ValidationPipe) createPlantDto: CreatePlantDto,
    @Req() req: { user: { id: number } },
  ): Promise<Plant> {
    return this.plantsService.create(createPlantDto, req.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: { user: { id: number } }): Promise<Plant[]> {
    return this.plantsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { id: number } }): Promise<Plant> {
    return this.plantsService.findOne(id, req.user.id);
  }


}