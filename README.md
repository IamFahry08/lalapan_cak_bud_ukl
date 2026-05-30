# 🥗 Lalapan Cak Bud — Backend API

> REST API untuk sistem pemesanan makanan online **Lalapan Cak Bud** — warung lalapan digital yang memudahkan customer memesan dari jarak jauh.

---

## 📋 Deskripsi Project

Lalapan Cak Bud adalah platform pemesanan makanan berbasis web yang memungkinkan customer untuk melihat menu, melakukan pemesanan, dan membayar secara online tanpa harus datang langsung ke warung. Admin dapat mengelola menu, kategori, dan memproses pesanan masuk.

Project ini dibuat sebagai bagian dari **Ujian Kenaikan Level (UKL)** dengan peran sebagai **Backend Developer**.

---

## 🛠️ Tech Stack

| Teknologi | Keterangan |
|-----------|-----------|
| **NestJS** | Framework backend utama |
| **TypeScript** | Bahasa pemrograman |
| **Prisma ORM v7** | Object Relational Mapper |
| **PostgreSQL** | Database utama |
| **JWT** | Autentikasi & otorisasi |
| **Swagger** | Dokumentasi API |
| **Railway** | Platform deployment |
| **Bcrypt** | Hash password |

---

## 👥 Role & Fitur

### Customer
- Register & login akun
- Lihat semua menu dan kategori
- Filter menu berdasarkan kategori
- Buat pesanan (order)
- Bayar pesanan (dummy payment)
- Lihat riwayat pesanan sendiri
- Tracking status pesanan

### Admin
- Login dengan akun admin
- Kelola kategori (CRUD)
- Kelola menu makanan (CRUD)
- Lihat semua pesanan masuk
- Update status pesanan (PENDING → PROCESSING → COMPLETED)
- Lihat semua data payment

---

## 🗃️ Database Schema

```
User (1) ──────── (banyak) Order
                              │
                              └── (banyak) OrderItem ──── (1) MenuItem
                              │
                              └── (1) Payment

Category (1) ──── (banyak) MenuItem
```

### Tabel
- **User** — data pengguna (admin & customer)
- **Category** — kategori menu (Lalapan, Minuman, dll)
- **MenuItem** — data menu makanan & minuman
- **Order** — data pesanan customer
- **OrderItem** — detail item dalam satu pesanan
- **Payment** — data pembayaran

### Enum
```prisma
enum Role {
  ADMIN
  CUSTOMER
}

enum OrderStatus {
  PENDING      // order baru masuk
  PROCESSING   // sedang dimasak
  COMPLETED    // selesai, siap diambil
}
```

---

## 📁 Struktur Folder

```
src/
├── auth/                    # Autentikasi (register, login, JWT)
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt.strategy.ts
├── categories/              # Kelola kategori menu
│   ├── dto/
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── categories.module.ts
├── menu-items/              # Kelola menu makanan
│   ├── dto/
│   ├── menu-items.controller.ts
│   ├── menu-items.service.ts
│   └── menu-items.module.ts
├── orders/                  # Kelola pesanan
│   ├── dto/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── payments/                # Kelola pembayaran
│   ├── payments.controller.ts
│   ├── payments.service.ts
│   └── payments.module.ts
├── prisma/                  # Koneksi database
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── common/                  # Guard & decorator bersama
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── decorators/
│       └── roles.decorator.ts
└── main.ts                  # Entry point aplikasi
prisma/
├── schema.prisma            # Schema database
├── seed.ts                  # Data awal database
└── migrations/              # Riwayat migrasi database
```

---

## 🚀 Cara Menjalankan Project

### Prasyarat
- Node.js v20+
- PostgreSQL (Postgres.app untuk Mac)
- NestJS CLI

### 1. Clone Repository
```bash
git clone https://github.com/IamFahry08/lalapan_cak_bud_ukl.git
cd lalapan_cak_bud_ukl
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root project:
```env
DATABASE_URL="postgresql://USERNAME@localhost:5432/lalapan_cak_bud?schema=public"
JWT_SECRET="lalapancakbud_secret_2025"
PORT=3000
```

### 4. Setup Database
```bash
# Buat database di PostgreSQL
createdb -U USERNAME lalapan_cak_bud

# Jalankan migration
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

### 5. Jalankan Seed Data
```bash
npm run seed
```

### 6. Jalankan Server
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 7. Akses Swagger Docs
Buka browser: `http://localhost:3000/api`

---

## 🔑 Akun Default (Setelah Seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@lalapancakbud.com | admin123 |
| Customer | customer@gmail.com | customer123 |

---

## 📡 Daftar Endpoint API

### Auth
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| POST | `/auth/register` | Public | Daftar akun baru |
| POST | `/auth/login` | Public | Login & dapat token |
| GET | `/auth/me` | Customer/Admin | Lihat profil sendiri |

### Categories
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| GET | `/categories` | Public | Lihat semua kategori |
| GET | `/categories/:id` | Public | Lihat kategori by ID |
| POST | `/categories` | Admin | Buat kategori baru |
| PATCH | `/categories/:id` | Admin | Update kategori |
| DELETE | `/categories/:id` | Admin | Hapus kategori |

### Menu Items
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| GET | `/menu-items` | Public | Lihat semua menu |
| GET | `/menu-items?categoryId=xxx` | Public | Filter menu by kategori |
| GET | `/menu-items/grouped` | Public | Menu dikelompokkan per kategori |
| GET | `/menu-items/:id` | Public | Lihat menu by ID |
| POST | `/menu-items` | Admin | Tambah menu baru |
| PATCH | `/menu-items/:id` | Admin | Update menu |
| DELETE | `/menu-items/:id` | Admin | Hapus menu |

### Orders
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| POST | `/orders` | Customer | Buat pesanan baru |
| GET | `/orders` | Admin | Lihat semua pesanan |
| GET | `/orders/my` | Customer | Lihat pesanan sendiri |
| GET | `/orders/:id` | Customer/Admin | Lihat detail pesanan |
| PATCH | `/orders/:id/status` | Admin | Update status pesanan |

### Payments
| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|-----------|
| POST | `/payments/:orderId` | Customer | Bayar pesanan |
| GET | `/payments` | Admin | Lihat semua payment |
| GET | `/payments/:orderId` | Customer/Admin | Detail payment |

---

## 🔐 Cara Autentikasi

Semua endpoint yang membutuhkan login harus menyertakan JWT token di header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Cara Dapat Token
1. Hit `POST /auth/login` dengan email & password
2. Copy nilai `access_token` dari response
3. Gunakan di header setiap request yang butuh autentikasi

---

## 💳 Alur Pemesanan

```
1. Customer login → dapat JWT token
         ↓
2. GET /categories → lihat kategori
         ↓
3. GET /menu-items → lihat & pilih menu
         ↓
4. POST /orders → buat pesanan
         ↓
5. POST /payments/:orderId → bayar (dummy)
         ↓
6. GET /orders/my → cek status pesanan
         ↓
7. Admin update status → PROCESSING → COMPLETED
```

---

## 📊 Contoh Request & Response

### Register
```json
POST /auth/register
{
  "name": "Budi Customer",
  "email": "budi@gmail.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "Register berhasil",
  "user": {
    "id": "uuid",
    "name": "Budi Customer",
    "email": "budi@gmail.com",
    "role": "CUSTOMER"
  }
}
```

### Buat Order
```json
POST /orders
Authorization: Bearer TOKEN

{
  "items": [
    { "menuItemId": "menu-ayam-goreng", "quantity": 2 },
    { "menuItemId": "menu-es-teh", "quantity": 1 }
  ],
  "note": "Pedas ya kak"
}

Response:
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "id": "uuid-order",
    "totalPrice": 35000,
    "status": "PENDING",
    "note": "Pedas ya kak",
    "orderItems": [...]
  }
}
```

### Update Status Order (Admin)
```json
PATCH /orders/:id/status
Authorization: Bearer TOKEN_ADMIN

{
  "status": "PROCESSING"
}
```

---

## 🌐 Deployment

Project ini di-deploy di **Railway**.

- **Base URL Production:** `https://lalapan-cak-bud.up.railway.app`
- **Swagger Docs:** `https://lalapan-cak-bud.up.railway.app/api`

### Environment Variables di Railway
```
DATABASE_URL    = (dari Railway PostgreSQL service)
JWT_SECRET      = lalapancakbud_secret_2025
NODE_ENV        = production
PORT            = 3000
```

---

## 👨‍💻 Developer

| Role | Nama |
|------|------|
| Backend Developer | Fahry |
| Frontend Developer | (Nama teman) |

**Sekolah:** SMK Telkom Malang  
**Kelas:** XI  
**Tahun:** 2026

---

> Dibuat dengan ❤️ untuk Ujian Kenaikan Level SMK Telkom Malang
