import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Customer' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'budi@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '08123456789' })
  @IsString()
  @IsOptional()
  phone?: string;
}
