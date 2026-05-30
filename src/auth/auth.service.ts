import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // inject PrismaService dan JwtService lewat constructor
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ==================
  // REGISTER
  // ==================
  async register(dto: RegisterDto) {
    // cek apakah email sudah terdaftar
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // kalau sudah ada, lempar error 409 Conflict
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // hash password sebelum disimpan ke database
    // angka 10 = salt rounds (semakin besar semakin aman tapi semakin lambat)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // simpan user baru ke database
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        // role tidak perlu diisi, otomatis CUSTOMER dari schema Prisma
      },
    });

    // return data user tapi TANPA password
    return {
      message: 'Register berhasil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ==================
  // LOGIN
  // ==================
  async login(dto: LoginDto) {
    // cari user berdasarkan email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // kalau email tidak ditemukan, lempar error 401
    // sengaja pesannya sama supaya tidak ketahuan mana yang salah
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // bandingkan password yang diketik dengan hash di database
    const isMatch = await bcrypt.compare(dto.password, user.password);

    // kalau password salah, lempar error 401
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    // buat JWT token
    // payload = data yang disimpan di dalam token
    const token = this.jwtService.sign({
      sub: user.id,      // sub = subject, biasanya diisi id user
      email: user.email,
      role: user.role,   // role penting untuk RolesGuard nanti
    });

    return {
      message: 'Login berhasil',
      access_token: token,  // ini yang disimpan frontend
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ==================
  // GET PROFILE
  // ==================
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User tidak ditemukan');

    // hapus password dari response
    const { password, ...result } = user;
    return result;
  }
}