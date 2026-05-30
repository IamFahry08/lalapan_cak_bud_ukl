import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // POST /payments/:orderId → customer bayar order
  @Post(':orderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Payment (customer) - Bayar order' })
  @ApiResponse({ status: 201, description: 'Pembayaran berhasil' })
  pay(@Param('orderId') orderId: string, @Request() req) {
    const userId = req.user.id;
    return this.paymentsService.pay(orderId, userId);
  }

  // GET /payments → admin lihat semua payment
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lihat order - Semua payment (admin)' })
  findAll() {
    return this.paymentsService.findAll();
  }

  // GET /payments/:orderId → lihat detail payment
  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detail payment by orderId' })
  findOne(@Param('orderId') orderId: string, @Request() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.paymentsService.findOne(orderId, userId, userRole);
  }
}
