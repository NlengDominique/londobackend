/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards/auth.guards';
import { User } from './entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Connexion réussie',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Identifiants invalides' 
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Request() req: { user: User }) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Inscription utilisateur' })
  @ApiResponse({ 
    status: 201, 
    description: 'Utilisateur créé avec succès',
    type: AuthResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Données invalides' 
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Récupérer le profil utilisateur' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profil récupéré avec succès',
    type: User 
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req : {user:User}): User {
    return req.user;
  }
}