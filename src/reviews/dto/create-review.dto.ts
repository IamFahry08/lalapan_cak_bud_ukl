import { IsNotEmpty, IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5, description: 'Rating bintang dari 1 sampai 5' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Lalapan ayam bakarnya juara! Bumbu meresap...', description: 'Ulasan rasa masakan, sambal, dll' })
  @IsNotEmpty()
  @IsString()
  menuReview: string;

  @ApiProperty({ example: 'Mohon jangkauan pengiriman diperluas ya', required: false, description: 'Kritik & saran opsional' })
  @IsOptional()
  @IsString()
  suggestions?: string;
}
