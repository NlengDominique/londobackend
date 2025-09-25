/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto, AuthResponseDto, LoginDto } from './dto/auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
  const loginDto = plainToInstance(LoginDto, { email, password });
  const errors = await validate(loginDto);

  if (errors.length > 0) {
    const messages = errors.map(err => Object.values(err.constraints || {})).flat();
    throw new BadRequestException(messages);
  }
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password'],
    });

    if (user && (await user.validatePassword(password))) {
   
      const { password: _, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: User): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email deja utilisee');
    }

    
    const user = this.userRepository.create(registerDto);
    const savedUser = await this.userRepository.save(user);
    return this.login(savedUser);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur pas trouve');
    }

    return user;
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur pas trouve');
    }

    return user;
  }
}