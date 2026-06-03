import { IsString, IsIn, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'QRIS',
    required: true,
    description: 'Metode pembayaran: QRIS, BANK_BCA, atau CASH',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['QRIS', 'BANK_BCA', 'CASH'])
  method: string;
}
