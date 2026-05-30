import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      // ambil token dari header Authorization: Bearer TOKEN
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // secret key yang sama dengan yang dipakai saat generate token
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }
  
  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    return user;
  }
}