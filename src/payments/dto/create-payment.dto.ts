import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'QRIS',
    required: false,
    description: 'Metode pembayaran: QRIS, BANK_BCA, atau CASH (Default: CASH)',
  })
  @IsOptional()
  @IsString()
  @IsIn(['QRIS', 'BANK_BCA', 'CASH'])
  method?: string;
}
