import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: 'PENDING, PROCESSING, COMPLETED, CANCELED' })
  @IsNotEmpty()
  @IsEnum(OrderStatus) // hanya boleh nilai dari enum OrderStatus
  status: OrderStatus;
}
