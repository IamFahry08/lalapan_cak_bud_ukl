import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO untuk tiap item yang dipesan
export class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'menu item id' })
  menuItemId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1) // minimal pesan 1
  quantity: number;
}

// DTO utama untuk buat order
export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true }) // validasi tiap item di array
  @Type(() => OrderItemDto) // transform tiap item jadi OrderItemDto
  items: OrderItemDto[];

  @ApiProperty({ example: 'Pedas ya kak', required: false })
  @IsOptional()
  @IsString()
  note?: string; // catatan dari customer, opsional
}
