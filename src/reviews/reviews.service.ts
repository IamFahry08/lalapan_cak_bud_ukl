import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

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
}
