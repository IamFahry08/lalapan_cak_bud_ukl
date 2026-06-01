import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // ====================
  // CREATE REVIEW
  // ====================
  async create(userId: string, dto: CreateReviewDto) {
    try {
      const review = await this.prisma.review.create({
        data: {
          rating: dto.rating,
          menuReview: dto.menuReview,
          suggestions: dto.suggestions,
          userId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Ulasan berhasil dikirim',
        data: review,
      };
    } catch (error) {
      console.error('Create review error:', error);
      return {
        success: false,
        message: `Gagal mengirim ulasan: ${error.message}`,
      };
    }
  }

  // ====================
  // FIND ALL REVIEWS (Include Stats)
  // ====================
  async findAll() {
    try {
      // 1. Ambil semua review ter-update
      const reviews = await this.prisma.review.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // 2. Hitung statistik rating menggunakan fitur agregasi Prisma
      const stats = await this.prisma.review.aggregate({
        _avg: {
          rating: true,
        },
        _count: {
          _all: true,
        },
      });

      // Format rata-rata rating menjadi 1 desimal (contoh: 4.8)
      const averageRating = stats._avg.rating
        ? parseFloat(stats._avg.rating.toFixed(1))
        : 0;

      const totalReviews = stats._count._all;

      return {
        success: true,
        message: 'Ulasan berhasil diambil',
        data: {
          stats: {
            averageRating,
            totalReviews,
          },
          reviews,
        },
      };
    } catch (error) {
      console.error('FindAll reviews error:', error);
      return {
        success: false,
        message: `Gagal mengambil ulasan: ${error.message}`,
      };
    }
  }

  // ====================
  // DELETE REVIEW (Untuk Admin)
  // ====================
  async remove(id: string) {
    try {
      await this.prisma.review.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Ulasan berhasil dihapus oleh admin',
      };
    } catch (error) {
      console.error('Delete review error:', error);
      return {
        success: false,
        message: `Gagal menghapus ulasan: ${error.message}`,
      };
    }
  }

  // ====================
  // UPDATE REVIEW (Owner Only)
  // ====================
  async update(id: string, userId: string, dto: UpdateReviewDto) {
    try {
      // 1. Cari ulasan yang mau diedit
      const existing = await this.prisma.review.findUnique({
        where: { id },
      });

      if (!existing) {
        return {
          success: false,
          message: 'Ulasan tidak ditemukan',
        };
      }

      // 2. Keamanan: Pastikan yang edit adalah pemilik ulasan
      if (existing.userId !== userId) {
        return {
          success: false,
          message: 'Anda tidak diizinkan mengubah ulasan milik orang lain',
        };
      }

      // 3. Update data di database
      const updatedReview = await this.prisma.review.update({
        where: { id },
        data: {
          rating: dto.rating,
          menuReview: dto.menuReview,
          suggestions: dto.suggestions,
        },
      });

      return {
        success: true,
        message: 'Ulasan berhasil diperbarui',
        data: updatedReview,
      };
    } catch (error) {
      console.error('Update review error:', error);
      return {
        success: false,
        message: `Gagal memperbarui ulasan: ${error.message}`,
      };
    }
  }
}
