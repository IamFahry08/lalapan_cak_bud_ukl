import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    try {
      const { name, description, price, imageUrl, isAvailable, categoryId } =
        createMenuItemDto;

      // cek apakah kategori yang dipilih ada
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return {
          succes: false,
          message: ' kategori tidak ditemukan',
        };
      }

      const menuItem = await this.prisma.menuItem.create({
        data: {
          name,
          description,
          price,
          imageUrl,
          isAvailable: isAvailable ?? true,
          categoryId,
        },
        include: {
          category: true,
        },
      });
      return {
        success: true,
        message: 'menu berhasil ditambahkan',
        data: menuItem,
      };
    } catch (error) {
      console.error('create error/gagal');
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  //beside category :
  async findAllGrouped() {
    try {
      const data = await this.prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          menuItems: {
            where: { isAvailable: true }, // hanya tampilkan menu yang tersedia
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      return {
        success: true,
        message: 'Menu berhasil diambil per kategori',
        data,
      };
    } catch (error) {
      console.error('FindAllGrouped error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  async findAll(categoryId?: string) {
    try {
      const menuItems = await this.prisma.menuItem.findMany({
        where: categoryId
          ? { categoryId } // kalau ada filter kategori, pakai
          : {}, // kalau tidak ada, ambil semua
        include: {
          category: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      return {
        success: true,
        message: 'Menu berhasil diambil',
        data: menuItems,
      };
    } catch (error) {
      console.error('FindAll menu item error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  async findOne(id: string) {
    try {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!menuItem) {
        throw new NotFoundException(`Menu dengan ID ${id} tidak ditemukan`);
      }

      return {
        success: true,
        message: 'fungsi sortir berdasarkan id berhasil : Menu berhasil diambil',
        data: menuItem,
      };
    } catch (error) {
      console.error('FindOne menu item error:', error);
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    try {
      //cek apakah menu ada
      const existingMenuItem = await this.prisma.menuItem.findUnique({
        where: { id },
      });

      if (!existingMenuItem) {
        throw new NotFoundException(`Menu dengan ID ${id} tidak ditemukan`);
      }
      const { name, description, price, imageUrl, isAvailable, categoryId } =
        updateMenuItemDto;

      //cek kalau ada categoryId baru, cek apakah valid
      if (categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: categoryId },
        });
        if (!category) {
          return {
            success: false,
            message: 'category tidak ditemukan',
          };
        }
      }

      const menuItem = await this.prisma.menuItem.update({
        where: { id },
        data: {
          name: name ? name : existingMenuItem.name,
          description: description ? description : existingMenuItem.description,
          price: price ? price : existingMenuItem.price,
          imageUrl: imageUrl ? imageUrl : existingMenuItem.imageUrl,
          isAvailable:
            isAvailable !== undefined
              ? isAvailable
              : existingMenuItem.isAvailable,
          categoryId: categoryId ? categoryId : existingMenuItem.categoryId,
        },
        include: {
          category: true,
        },
      });

      return {
        success: true,
        message: 'Menu berhasil diupdate',
        data: menuItem,
      };
    } catch (error) {
      console.error(`Update Gagal:${error.message}`);
      return {
        success: false,
        message: `gagal update, ada yang salah:${error.message}`,
      };
    }
  }

  async remove(id: string) {
    try {
      // cek apakah menu ada
      const existingMenuItem = await this.prisma.menuItem.findUnique({
        where: { id },
      });

      if (!existingMenuItem) {
        throw new NotFoundException(`Menu dengan ID ${id} tidak ditemukan`);
      }

      //hapus menu
      await this.prisma.menuItem.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'menu berhasil dihapus',
      };
    } catch (error) {
      console.error(`Gagal menghapus menu : ${error.message}`);
      return {
        success: false,
        message: `Gagal menghapus menu : ${error.message}`,
      };
    }
  }
}
