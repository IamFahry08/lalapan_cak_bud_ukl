import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // POST /orders → customer buat order baru
  async create(createOrderDto: CreateOrderDto, userId: string) {
    try {
      const { items, note } = createOrderDto;

      // hitung total harga semua item
      let totalPrice = 0;

      // validasi semua menuItem ada dan hitung harga
      const orderItemsData: { menuItemId: string; quantity: number; price: number }[] = [];

      for (const item of items) {
        const menuItem = await this.prisma.menuItem.findUnique({
          where: { id: item.menuItemId },
        });

        // kalau menu tidak ditemukan
        if (!menuItem) {
          return {
            success: false,
            message: `Menu dengan ID ${item.menuItemId} tidak ditemukan`,
          };
        }

        // kalau menu tidak tersedia
        if (!menuItem.isAvailable) {
          return {
            success: false,
            message: `Menu ${menuItem.name} sedang tidak tersedia`,
          };
        }

        // hitung harga item ini
        const itemPrice = menuItem.price * item.quantity;
        totalPrice += itemPrice;

        // simpan data untuk OrderItem
        orderItemsData.push({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,  // snapshot harga saat order dibuat
        });
      }

      // buat Order dan semua OrderItem dalam satu transaksi atomik
      // kalau salah satu gagal, semuanya rollback
      const order = await this.prisma.$transaction(async (prisma) => {
        // buat Order dulu
        const newOrder = await prisma.order.create({
          data: {
            userId,
            totalPrice,
            note,
            // status otomatis PENDING dari schema
          },
        });

        // buat semua OrderItem sekaligus
        await prisma.orderItem.createMany({
          data: orderItemsData.map((item) => ({
            ...item,
            orderId: newOrder.id,
          })),
        });

        // return order lengkap dengan semua relasinya
        return prisma.order.findUnique({
          where: { id: newOrder.id },
          include: {
            orderItems: {
              include: {
                menuItem: true,  // tampilkan detail menu
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
        });
      });

      return {
        success: true,
        message: 'Order berhasil dibuat',
        data: order,
      };
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // GET /orders → admin lihat semua order
  async findAll() {
    try {
      const orders = await this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },  // terbaru duluan
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
          payment: true,
        },
      });

      return {
        success: true,
        message: 'Semua order berhasil diambil',
        data: orders,
      };
    } catch (error) {
      console.error('FindAll order error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // GET /orders/my → customer lihat order miliknya sendiri
  async findMyOrders(userId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId },  // filter by userId dari JWT token
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
          payment: true,
        },
      });

      return {
        success: true,
        message: 'Order kamu berhasil diambil',
        data: orders,
      };
    } catch (error) {
      console.error('FindMyOrders error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // GET /orders/:id → lihat detail satu order
  async findOne(id: string, userId: string, userRole: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
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
          payment: true,
        },
      });

      if (!order) {
        throw new NotFoundException(`Order dengan ID ${id} tidak ditemukan`);
      }

      // customer hanya boleh lihat order miliknya sendiri
      // admin boleh lihat semua order
      if (userRole !== 'ADMIN' && order.userId !== userId) {
        throw new ForbiddenException('Kamu tidak punya akses ke order ini');
      }

      return {
        success: true,
        message: 'Order berhasil diambil',
        data: order,
      };
    } catch (error) {
      console.error('FindOne order error:', error);
      if (error instanceof NotFoundException) throw error;
      if (error instanceof ForbiddenException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // PATCH /orders/:id/status → admin update status order
  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const { status } = updateOrderStatusDto;

      // cek apakah order ada
      const existing = await this.prisma.order.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Order dengan ID ${id} tidak ditemukan`);
      }

      const order = await this.prisma.order.update({
        where: { id },
        data: { status },
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
          payment: true,
        },
      });

      return {
        success: true,
        message: `Status order berhasil diupdate ke ${status}`,
        data: order,
      };
    } catch (error) {
      console.error('UpdateStatus order error:', error);
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }
}