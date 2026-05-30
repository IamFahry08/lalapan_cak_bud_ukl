import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Mulai seeding...');

  // =====================
  // BUAT AKUN ADMIN
  // =====================
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lalapancakbud.com' },
    update: {},  // kalau sudah ada, tidak diupdate
    create: {
      name: 'Admin Lalapan Cak Bud',
      email: 'admin@lalapancakbud.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin dibuat:', admin.email);

  // =====================
  // BUAT AKUN CUSTOMER
  // =====================
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@gmail.com' },
    update: {},
    create: {
      name: 'Budi Customer',
      email: 'customer@gmail.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer dibuat:', customer.email);

  // =====================
  // BUAT KATEGORI
  // =====================
  const kategoriLalapan = await prisma.category.upsert({
    where: { name: 'Lalapan' },
    update: {},
    create: { name: 'Lalapan' },
  });

  const kategoriMinuman = await prisma.category.upsert({
    where: { name: 'Minuman' },
    update: {},
    create: { name: 'Minuman' },
  });

  const kategoriGorengan = await prisma.category.upsert({
    where: { name: 'Gorengan' },
    update: {},
    create: { name: 'Gorengan' },
  });

  const kategoriSambal = await prisma.category.upsert({
    where: { name: 'Sambal' },
    update: {},
    create: { name: 'Sambal' },
  });

  console.log('✅ Kategori dibuat: Lalapan, Minuman, Gorengan, Sambal');

  // =====================
  // BUAT MENU ITEMS
  // =====================

  // Lalapan
  await prisma.menuItem.upsert({
    where: { id: 'menu-ayam-goreng' },
    update: {},
    create: {
      id: 'menu-ayam-goreng',
      name: 'Ayam Goreng Lalapan',
      description: 'Ayam goreng crispy dengan lalapan segar dan sambal',
      price: 15000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriLalapan.id,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'menu-lele-goreng' },
    update: {},
    create: {
      id: 'menu-lele-goreng',
      name: 'Lele Goreng Lalapan',
      description: 'Lele goreng garing dengan lalapan segar dan sambal',
      price: 13000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriLalapan.id,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'menu-tahu-tempe' },
    update: {},
    create: {
      id: 'menu-tahu-tempe',
      name: 'Tahu Tempe Lalapan',
      description: 'Tahu dan tempe goreng dengan lalapan segar',
      price: 10000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriLalapan.id,
    },
  });

  // Minuman
  await prisma.menuItem.upsert({
    where: { id: 'menu-es-teh' },
    update: {},
    create: {
      id: 'menu-es-teh',
      name: 'Es Teh Manis',
      description: 'Teh manis segar dengan es batu',
      price: 5000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriMinuman.id,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'menu-es-jeruk' },
    update: {},
    create: {
      id: 'menu-es-jeruk',
      name: 'Es Jeruk',
      description: 'Jeruk peras segar dengan es batu',
      price: 7000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriMinuman.id,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'menu-air-putih' },
    update: {},
    create: {
      id: 'menu-air-putih',
      name: 'Air Putih',
      description: 'Air mineral',
      price: 3000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriMinuman.id,
    },
  });

  // Gorengan
  await prisma.menuItem.upsert({
    where: { id: 'menu-tempe-goreng' },
    update: {},
    create: {
      id: 'menu-tempe-goreng',
      name: 'Tempe Goreng',
      description: 'Tempe goreng crispy',
      price: 3000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriGorengan.id,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'menu-tahu-goreng' },
    update: {},
    create: {
      id: 'menu-tahu-goreng',
      name: 'Tahu Goreng',
      description: 'Tahu goreng crispy',
      price: 3000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriGorengan.id,
    },
  });

  // Sambal
  await prisma.menuItem.upsert({
    where: { id: 'menu-sambal-terasi' },
    update: {},
    create: {
      id: 'menu-sambal-terasi',
      name: 'Sambal Terasi',
      description: 'Sambal terasi pedas khas warung',
      price: 2000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriSambal.id,
    },
  });

  await prisma.menuItem.upsert({
    where: { id: 'menu-sambal-hijau' },
    update: {},
    create: {
      id: 'menu-sambal-hijau',
      name: 'Sambal Hijau',
      description: 'Sambal hijau segar khas Padang',
      price: 2000,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ayam_goreng.jpg/800px-Ayam_goreng.jpg',
      isAvailable: true,
      categoryId: kategoriSambal.id,
    },
  });

  console.log('✅ Menu items dibuat!');
  console.log('🎉 Seeding selesai!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });