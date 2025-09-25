/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({},{message:"Email invalide"})
  @IsNotEmpty({message:"Email est obligatoire"})
  email: string;

  @IsString()
  @IsNotEmpty({message:"le mot de passe est obligatoire"})
  @MinLength(6,{message:'Le mot de passe doit contenir au moins 6 caractères'})
  password: string;
}

export class RegisterDto {
  @IsEmail({},{message:"Email invalide"})
  @IsNotEmpty({message:"Email est obligatoire"})
  email: string;

  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @IsNotEmpty({message:"Le nom est obligatoire"})
  name: string;

  @IsString()
  @IsNotEmpty({message:"le mot de passe est obligatoire"})
  @MinLength(6,{message:'Le mot de passe doit contenir au moins 6 caractères'})
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}