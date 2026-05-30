import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  // POST /payments/:orderId → customer bayar
  async pay(orderId: string, userId: string) {
    try {
      // cek apakah order ada
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException(`Order dengan ID ${orderId} tidak ditemukan`);
      }

      // cek apakah order milik customer yang request
      if (order.userId !== userId) {
        return {
          success: false,
          message: 'Kamu tidak punya akses ke order ini',
        };
      }

      // cek apakah order sudah dibayar sebelumnya
      const existingPayment = await this.prisma.payment.findUnique({
        where: { orderId },
      });

      if (existingPayment) {
        return {
          success: false,
          message: 'Order ini sudah dibayar sebelumnya',
        };
      }

      // cek apakah order masih PENDING
      if (order.status !== 'PENDING') {
        return {
          success: false,
          message: 'Order ini tidak bisa dibayar karena statusnya bukan PENDING',
        };
      }

      // buat payment dan update status order dalam satu transaksi
      const result = await this.prisma.$transaction(async (prisma) => {
        // buat record payment
        const payment = await prisma.payment.create({
          data: {
            orderId,
            amount: order.totalPrice,
            method: 'DUMMY',
            status: 'PAID',
          },
        });

        // update status order jadi PROCESSING
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PROCESSING' },
          include: {
            orderItems: {
              include: {
                menuItem: true,
              },
            },
            payment: true,
          },
        });

        return { payment, order: updatedOrder };
      });

      return {
        success: true,
        message: 'Pembayaran berhasil! Pesanan sedang diproses',
        data: result,
      };
    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // GET /payments/:orderId → lihat detail payment
  async findOne(orderId: string, userId: string, userRole: string) {
    try {
      const payment = await this.prisma.payment.findUnique({
        where: { orderId },
        include: {
          order: {
            include: {
              orderItems: {
                include: {
                  menuItem: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!payment) {
        throw new NotFoundException('Payment tidak ditemukan');
      }

      // customer hanya boleh lihat payment miliknya
      if (userRole !== 'ADMIN' && payment.order.userId !== userId) {
        return {
          success: false,
          message: 'Kamu tidak punya akses ke payment ini',
        };
      }

      return {
        success: true,
        message: 'Payment berhasil diambil',
        data: payment,
      };
    } catch (error) {
      console.error('FindOne payment error:', error);
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // GET /payments → admin lihat semua payment
  async findAll() {
    try {
      const payments = await this.prisma.payment.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        message: 'Semua payment berhasil diambil',
        data: payments,
      };
    } catch (error) {
      console.error('FindAll payment error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }
}