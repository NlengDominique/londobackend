import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';

@Controller('plants')
@UseGuards(JwtAuthGuard)
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createPlantDto: CreatePlantDto, @Request() req) {
    return this.plantsService.create(createPlantDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.plantsService.findAll(req.user.id);
  }

  @Get('notifications')
  getPlantsNeedingWater(@Request() req) {
    return this.plantsService.getPlantsNeedingWater(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.plantsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePlantDto: UpdatePlantDto,
    @Request() req,
  ) {
    return this.plantsService.update(id, updatePlantDto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.plantsService.remove(id, req.user.id);
  }
}