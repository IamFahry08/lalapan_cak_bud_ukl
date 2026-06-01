import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Ulasan Pelanggan')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ====================
  // POST /reviews → Kirim Ulasan Baru (User Login)
  // ====================
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kirim ulasan baru (Hanya untuk pelanggan login)' })
  @ApiResponse({ status: 201, description: 'Ulasan berhasil dikirim' })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  @ApiResponse({ status: 401, description: 'Unauthorized / Token JWT salah' })
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, createReviewDto);
  }

  // ====================
  // GET /reviews → Ambil semua ulasan & performa statistik (Public)
  // ====================
  @Get()
  @ApiOperation({ summary: 'Ambil semua ulasan & performa statistik warung' })
  @ApiResponse({ status: 200, description: 'Ulasan dan statistik berhasil diambil' })
  findAll() {
    return this.reviewsService.findAll();
  }

  // ====================
  // DELETE /reviews/:id → Hapus Ulasan (Hanya Admin)
  // ====================
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hapus ulasan pelanggan (Hanya Admin)' })
  @ApiResponse({ status: 200, description: 'Ulasan berhasil dihapus oleh admin' })
  @ApiResponse({ status: 404, description: 'Ulasan tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
