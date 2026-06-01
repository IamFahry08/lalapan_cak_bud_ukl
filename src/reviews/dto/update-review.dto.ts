import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, required: false, description: 'Rating baru (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 'Rasa ayam gorengnya enak banget!', required: false, description: 'Ulasan rasa masakan baru' })
  @IsOptional()
  @IsString()
  menuReview?: string;

  @ApiProperty({ example: 'Sambalnya tolong dibanyakin', required: false, description: 'Kritik & saran baru (opsional)' })
  @IsOptional()
  @IsString()
  suggestions?: string;
}
