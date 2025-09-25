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
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards/auth.guards';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
@UseGuards(LocalAuthGuard)
@Post('login')
@HttpCode(HttpStatus.OK)
async login(@Request() req: { user: User }) {
  return this.authService.login(req.user);
}


  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    return this.authService.getProfile(req.user.id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('me')
  // async getMe(@Request() req): Promise<User> {
  //   return req.user;
  // }
}