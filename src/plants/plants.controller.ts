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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guards';
import { Plant } from './entities/plant.entity';

@ApiTags('plantes')
@ApiBearerAuth()
@Controller('plants')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une nouvelle plante' })
  @ApiResponse({ 
    status: 201, 
    description: 'La plante a été créée avec succès',
    type: Plant
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Données invalides' 
  })
  create(
    @Body(ValidationPipe) createPlantDto: CreatePlantDto,
    @Req() req: { user: { id: number } },
  ): Promise<Plant> {
    return this.plantsService.create(createPlantDto, req.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Récupérer toutes les plantes de l\'utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des plantes récupérée avec succès',
    type: [Plant]
  })
  findAll(@Req() req: { user: { id: number } }): Promise<Plant[]> {
    return this.plantsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une plante par son ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'La plante a été trouvée',
    type: Plant
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Plante non trouvée' 
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: { user: { id: number } }): Promise<Plant> {
    return this.plantsService.findOne(id, req.user.id);
  }


}