import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderItemDto } from './create-order.dto';
import { OrderType } from '@prisma/client';

export class CreateGuestOrderDto {
  @ApiProperty({ example: 'Budi' })
  @IsNotEmpty()
  @IsString()
  guestName: string;

  @ApiProperty({ example: '08123456789' })
  @IsNotEmpty()
  @IsString()
  guestPhone: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    enum: OrderType,
    example: 'TAKE_AWAY',
    description: 'DINE_IN = makan di tempat, TAKE_AWAY = bawa pulang',
    required: false,
    default: 'DINE_IN',
  })
  @IsOptional()
  @IsEnum(OrderType)
  orderType?: OrderType;

  @ApiProperty({ example: 'Pedas ya kak', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
