import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Budi Cahyono', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '08123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
