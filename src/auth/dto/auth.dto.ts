/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface UserDto {
  id: number;
  email: string;
  name: string;
}

export class AuthCredentialsDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Adresse email de l\'utilisateur',
  })
  @IsEmail({}, { message: "Email invalide" })
  @IsNotEmpty({ message: "Email est obligatoire" })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mot de passe (minimum 6 caractères)',
    minimum: 6,
  })
  @IsString()
  @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  password: string;
}

export class LoginDto extends AuthCredentialsDto {}

export class RegisterDto extends AuthCredentialsDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nom de l\'utilisateur',
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({ message: "Le nom est obligatoire" })
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT d\'authentification',
  })
  access_token: string;

  @ApiProperty({
    example: {
      id: 1,
      email: 'user@example.com',
      name: 'John Doe',
    },
    description: 'Informations de l\'utilisateur',
  })
  user:UserDto
}