import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // GET /orders → admin lihat semua order
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lihat order (admin) - Semua order' })
  findAll() {
    return this.ordersService.findAll();
  }

  // POST /orders → customer buat order
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buat order (Customer)' })
  @ApiResponse({ status: 201, description: 'Order berhasil dibuat' })
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    // ambil userId dari JWT token
    const userId = req.user.id;
    return this.ordersService.create(createOrderDto, userId);
  }

  // GET /orders/my → customer lihat order sendiri
  // PENTING: route 'my' harus di atas ':id'
  // karena kalau ':id' duluan, 'my' akan dianggap sebagai id
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Order (id category) (customer) - Order milik saya',
  })
  findMyOrders(@Request() req) {
    const userId = req.user.id;
    return this.ordersService.findMyOrders(userId);
  }

  // GET /orders/:id → admin atau customer pemilik order
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lihat detail order by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.ordersService.findOne(id, userId, userRole);
  }

  // PATCH /orders/:id/status → admin update status
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Status (admin) - Update status order' })
  @ApiResponse({ status: 200, description: 'Status berhasil diupdate' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
