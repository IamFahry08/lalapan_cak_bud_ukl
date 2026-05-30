import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()  // boleh tidak diisi
  @IsString()
  name?: string;
}