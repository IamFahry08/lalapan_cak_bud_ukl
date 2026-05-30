import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // extends AuthGuard('jwt') artinya pakai JwtStrategy yang sudah kita buat
  // tidak perlu tambah logika apapun di sini
  // otomatis verifikasi token dari header Authorization: Bearer TOKEN
}