import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name } = createCategoryDto;

      // cek apakah nama kategori sudah ada
      const existing = await this.prisma.category.findUnique({
        where: { name },
      });

      if (existing) {
        return {
          success: false,
          message: 'Nama kategori sudah ada',
        };
      }

      const category = await this.prisma.category.create({
        data: { name },
      });

      return {
        success: true,
        message: 'Kategori berhasil dibuat',
        data: category,
      };
    } catch (error) {
      console.error('Create category error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          menuItems: true,  // tampilkan menu tiap kategori
        },
      });

      return {
        success: true,
        message: 'Kategori berhasil diambil',
        data: categories,
      };
    } catch (error) {
      console.error('FindAll category error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          menuItems: true,
        },
      });

      if (!category) {
        throw new NotFoundException(`Kategori dengan ID ${id} tidak ditemukan`);
      }

      return {
        success: true,
        message: 'Kategori berhasil diambil',
        data: category,
      };
    } catch (error) {
      console.error('FindOne category error:', error);
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      // cek apakah kategori ada
      const existing = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Kategori dengan ID ${id} tidak ditemukan`);
      }

      const { name } = updateCategoryDto;

      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name: name ? name : existing.name,  // kalau tidak diisi, pakai yang lama
        },
      });

      return {
        success: true,
        message: 'Kategori berhasil diupdate',
        data: category,
      };
    } catch (error) {
      console.error('Update category error:', error);
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  async remove(id: string) {
    try {
      // cek apakah kategori ada
      const existing = await this.prisma.category.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException(`Kategori dengan ID ${id} tidak ditemukan`);
      }

      await this.prisma.category.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Kategori berhasil dihapus',
      };
    } catch (error) {
      console.error('Remove category error:', error);
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }
}