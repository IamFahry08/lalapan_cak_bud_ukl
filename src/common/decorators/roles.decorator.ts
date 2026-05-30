import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// kunci untuk menyimpan metadata role
export const ROLES_KEY = 'roles';

// decorator @Roles() yang bisa dipakai di controller
// contoh pemakaian: @Roles(Role.ADMIN)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);