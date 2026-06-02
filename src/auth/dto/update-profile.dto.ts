import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';
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

  @ApiProperty({ example: 'budi@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123456', required: false, description: 'Password lama untuk verifikasi sebelum mengganti password baru' })
  @IsOptional()
  @IsString()
  oldPassword?: string;

  @ApiProperty({ example: 'newpassword123', required: false, description: 'Password baru minimal 6 karakter' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  newPassword?: string;
}
