import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ==================
  // REGISTER
  // ==================
  async register(dto: RegisterDto) {
    try {
      const { name, email, password } = dto;

      // cek apakah email sudah terdaftar
      const existing = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        return {
          success: false,
          message: 'Email sudah terdaftar',
        };
      }

      // hash password sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: dto.phone, // simpan phone jika ada
          // role otomatis CUSTOMER dari schema
        },
      });

      return {
        success: true,
        message: 'Register berhasil',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // ==================
  // LOGIN
  // ==================
  async login(dto: LoginDto) {
    try {
      const { email, password } = dto;

      // cari user berdasarkan email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      // kalau email tidak ditemukan
      if (!user) {
        return {
          success: false,
          message: 'Email tidak terdaftar',  // ← lebih informatif
        };
      }

      // bandingkan password dengan hash di database
      const isMatch = await bcrypt.compare(password, user.password);

      // kalau password salah
      if (!isMatch) {
        return {
          success: false,
          message: 'Password salah',  // ← lebih informatif
        };
      }

      // buat JWT token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        message: 'Login berhasil',
        data: {
          access_token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // ==================
  // GET PROFILE
  // ==================
  async getProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          message: 'User tidak ditemukan',
        };
      }

      // hapus password dari response
      const { password, ...result } = user;

      return {
        success: true,
        message: 'Profile berhasil diambil',
        data: result,
      };
    } catch (error) {
      console.error('GetProfile error:', error);
      return {
        success: false,
        message: `Ada yang salah: ${error.message}`,
      };
    }
  }

  // ==================
  // UPDATE PROFILE
  // ==================
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    try {
      // 1. Ambil data user saat ini dari database
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          success: false,
          message: 'User tidak ditemukan',
        };
      }

      // Siapkan object untuk menyimpan data yang akan diupdate
      const updateData: any = {};

      if (dto.name !== undefined) {
        updateData.name = dto.name;
      }

      if (dto.phone !== undefined) {
        updateData.phone = dto.phone;
      }

      // Jika ada perubahan email
      if (dto.email !== undefined && dto.email !== user.email) {
        // Cek apakah email baru sudah dipakai oleh orang lain
        const existingEmail = await this.prisma.user.findUnique({
          where: { email: dto.email },
        });

        if (existingEmail) {
          return {
            success: false,
            message: 'Email sudah terdaftar oleh pengguna lain',
          };
        }
        updateData.email = dto.email;
      }

      // Jika ada perubahan password (mengisi newPassword)
      if (dto.newPassword !== undefined && dto.newPassword !== '') {
        // Wajib sertakan oldPassword
        if (!dto.oldPassword) {
          return {
            success: false,
            message: 'Password lama harus diisi untuk mengganti password',
          };
        }

        // Bandingkan password lama dengan password di database
        const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
        if (!isMatch) {
          return {
            success: false,
            message: 'Password lama salah',
          };
        }

        // Hash password baru sebelum disimpan
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        updateData.password = hashedPassword;
      }

      // Update data di database
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      const { password, ...result } = updatedUser;

      return {
        success: true,
        message: 'Profile berhasil diperbarui',
        data: result,
      };
    } catch (error) {
      console.error('UpdateProfile error:', error);
      return {
        success: false,
        message: `Gagal memperbarui profile: ${error.message}`,
      };
    }
  }
}