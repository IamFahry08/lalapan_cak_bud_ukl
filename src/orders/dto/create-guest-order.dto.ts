import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderItemDto } from './create-order.dto';

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

  @ApiProperty({ example: 'Pedas ya kak', required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
