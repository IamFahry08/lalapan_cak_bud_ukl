import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // baca metadata @Roles() dari endpoint yang sedang diakses
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),  // cek di level method
      context.getClass(),    // cek di level class/controller
    ]);

    // kalau endpoint tidak pakai @Roles(), berarti semua role boleh akses
    if (!requiredRoles) return true;

    // ambil data user dari request (diisi oleh JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // cek apakah role user ada di daftar role yang diizinkan
    return requiredRoles.includes(user.role);
  }
}