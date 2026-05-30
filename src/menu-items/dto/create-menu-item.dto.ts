import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuItemDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 15000 })
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, required: false })
  isAvailable?: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'uuid-"kategori-lalapan"' })
  categoryId: string;
}