# 🥗 Lalapan Cak Bud — Backend API

> REST API untuk sistem pemesanan makanan online **Lalapan Cak Bud** — warung lalapan digital yang memudahkan customer memesan dari jarak jauh.

---

## 📋 Deskripsi Project

Lalapan Cak Bud adalah platform pemesanan makanan berbasis web yang memungkinkan customer untuk melihat menu, melakukan pemesanan, dan membayar secara online tanpa harus datang langsung ke warung. Admin dapat mengelola menu, kategori, dan memproses pesanan masuk.

Sistem mendukung **dua mode pemesanan**:
- **Customer login** — registrasi akun, login, pesan, bayar, dan tracking pesanan
- **Guest order** — pesan tanpa perlu daftar akun (cukup isi nama & nomor HP)

Project ini dibuat sebagai bagian dari **Ujian Kenaikan Level (UKL)** dengan peran sebagai **Backend Developer**.

---

## 🛠️ Tech Stack

| Teknologi         | Keterangan               |
| ----------------- | ------------------------ |
| **NestJS**        | Framework backend utama  |
| **TypeScript**    | Bahasa pemrograman       |
| **Prisma ORM v7** | Object Relational Mapper |
| **PostgreSQL**    | Database utama           |
| **JWT**           | Autentikasi & otorisasi  |
| **Swagger**       | Dokumentasi API          |
| **Railway**       | Platform deployment      |
| **Bcrypt**        | Hash password            |

---

## 👥 Role & Fitur

### Customer (Login)

- Register & login akun
- Lihat semua menu dan kategori
- Filter menu berdasarkan kategori
- Buat pesanan (order)
- **Diskon 50% untuk pesanan pertama** 🎉
- Bayar pesanan (dummy payment)
- Lihat riwayat pesanan sendiri
- Tracking status pesanan
- **Pesan ulang (reorder)** dari pesanan sebelumnya

### Guest (Tanpa Login)

- Lihat semua menu dan kategori
- **Buat pesanan tanpa akun** (cukup isi nama & nomor HP)
- **Bayar pesanan guest** (dummy payment)
- **Tracking pesanan** menggunakan Order ID
- **Cek riwayat pesanan** menggunakan nomor HP

### Admin

- Login dengan akun admin
- Kelola kategori (CRUD)
- Kelola menu makanan (CRUD)
- Lihat semua pesanan masuk (termasuk guest order)
- Update status pesanan (PENDING → PROCESSING → COMPLETED)
- Lihat semua data payment

---

## 🗃️ Database Schema

```
User (1) ──────── (banyak) Order
                              │
                              ├── guestName, guestPhone  (untuk guest order)
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
- **Order** — data pesanan (customer login maupun guest)
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

### Model Order (Updated)

```prisma
model Order {
  id         String      @id @default(uuid())
  totalPrice Int
  status     OrderStatus @default(PENDING)
  note       String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  // relasi ke User (opsional, karena bisa guest order)
  userId     String?
  user       User?       @relation(fields: [userId], references: [id])

  // data guest (diisi kalau order tanpa login)
  guestName  String?
  guestPhone String?

  orderItems OrderItem[]
  payment    Payment?
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
├── orders/                  # Kelola pesanan (customer + guest)
│   ├── dto/
│   │   ├── create-order.dto.ts
│   │   ├── create-guest-order.dto.ts   # ← BARU: DTO untuk guest order
│   │   └── update-order-status.dto.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── payments/                # Kelola pembayaran (customer + guest)
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
umume
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

| Role     | Email                   | Password    |
| -------- | ----------------------- | ----------- |
| Admin    | admin@lalapancakbud.com | admin123    |
| Customer | customer@gmail.com      | customer123 |

---

## 📡 Daftar Endpoint API

### Auth

| Method | Endpoint         | Akses          | Keterangan           |
| ------ | ---------------- | -------------- | -------------------- |
| POST   | `/auth/register` | Public         | Daftar akun baru     |
| POST   | `/auth/login`    | Public         | Login & dapat token  |
| GET    | `/auth/me`       | Customer/Admin | Lihat profil sendiri |

### Categories

| Method | Endpoint          | Akses  | Keterangan           |
| ------ | ----------------- | ------ | -------------------- |
| GET    | `/categories`     | Public | Lihat semua kategori |
| GET    | `/categories/:id` | Public | Lihat kategori by ID |
| POST   | `/categories`     | Admin  | Buat kategori baru   |
| PATCH  | `/categories/:id` | Admin  | Update kategori      |
| DELETE | `/categories/:id` | Admin  | Hapus kategori       |

### Menu Items

| Method | Endpoint                     | Akses  | Keterangan                      |
| ------ | ---------------------------- | ------ | ------------------------------- |
| GET    | `/menu-items`                | Public | Lihat semua menu                |
| GET    | `/menu-items?categoryId=xxx` | Public | Filter menu by kategori         |
| GET    | `/menu-items/grouped`        | Public | Menu dikelompokkan per kategori |
| GET    | `/menu-items/:id`            | Public | Lihat menu by ID                |
| POST   | `/menu-items`                | Admin  | Tambah menu baru                |
| PATCH  | `/menu-items/:id`            | Admin  | Update menu                     |
| DELETE | `/menu-items/:id`            | Admin  | Hapus menu                      |

### Orders

| Method | Endpoint                        | Akses          | Keterangan                    |
| ------ | ------------------------------- | -------------- | ----------------------------- |
| POST   | `/orders`                       | Customer       | Buat pesanan baru (login)     |
| POST   | `/orders/guest`                 | **Public**     | **Buat pesanan tanpa login**  |
| POST   | `/orders/:id/reorder`           | Customer       | **Pesan ulang order lama**    |
| GET    | `/orders`                       | Admin          | Lihat semua pesanan           |
| GET    | `/orders/me`                    | Customer       | Lihat pesanan sendiri         |
| GET    | `/orders/:id`                   | Customer/Admin | Lihat detail pesanan          |
| GET    | `/orders/guest/track/:orderId`  | **Public**     | **Tracking pesanan guest**    |
| PATCH  | `/orders/:id/status`            | Admin          | Update status pesanan         |

### Payments

| Method | Endpoint                     | Akses          | Keterangan              |
| ------ | ---------------------------- | -------------- | ----------------------- |
| POST   | `/payments/:orderId`         | Customer       | Bayar pesanan (login)   |
| POST   | `/payments/guest/:orderId`   | **Public**     | **Bayar pesanan guest** |
| GET    | `/payments`                  | Admin          | Lihat semua payment     |
| GET    | `/payments/:orderId`         | Customer/Admin | Detail payment          |

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

### Alur Customer (Login)

```
1. Customer register → POST /auth/register
         ↓
2. Customer login → POST /auth/login → dapat JWT token
         ↓
3. Lihat kategori → GET /categories
         ↓
4. Lihat & pilih menu → GET /menu-items
         ↓
5. Buat pesanan → POST /orders
   ✨ Diskon 50% jika ini pesanan pertama!
         ↓
6. Bayar pesanan → POST /payments/:orderId (dummy)
         ↓
7. Cek status → GET /orders/me
         ↓
8. Admin update status → PENDING → PROCESSING → COMPLETED
         ↓
9. (Opsional) Pesan ulang → POST /orders/:id/reorder
```

### Alur Guest (Tanpa Login)

```
1. Lihat menu → GET /menu-items
         ↓
2. Buat pesanan → POST /orders/guest
   (isi nama & nomor HP, tidak perlu akun)
         ↓
3. Simpan Order ID dari response
         ↓
4. Bayar pesanan → POST /payments/guest/:orderId (dummy)
         ↓
5. Tracking pesanan → GET /orders/guest/track/:orderId
         ↓
6. Admin update status → PENDING → PROCESSING → COMPLETED
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
  "message": "Register berhasil",
  "user": {
    "id": "uuid",
    "name": "Budi Customer",
    "email": "budi@gmail.com",
    "role": "CUSTOMER"
  }
}
```

### Buat Order (Customer Login)

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
    "totalPrice": 17500,
    "status": "PENDING",
    "note": "Pedas ya kak",
    "orderItems": [...]
  }
}
```

> **Note:** totalPrice = 17.500 karena diskon 50% untuk pesanan pertama (harga asli Rp 35.000)

### Buat Order Guest (Tanpa Login)

```json
POST /orders/guest

{
  "guestName": "Budi",
  "guestPhone": "08123456789",
  "items": [
    { "menuItemId": "menu-ayam-goreng", "quantity": 1 },
    { "menuItemId": "menu-es-teh", "quantity": 2 }
  ],
  "note": "Tidak pake sambal"
}

Response:
{
  "success": true,
  "message": "Order guest berhasil dibuat",
  "data": {
    "id": "uuid-order",
    "totalPrice": 25000,
    "status": "PENDING",
    "guestName": "Budi",
    "guestPhone": "08123456789",
    "orderItems": [...]
  }
}
```

### Bayar Pesanan Guest

```json
POST /payments/guest/:orderId

Response:
{
  "success": true,
  "message": "Pembayaran guest berhasil! Pesanan sedang diproses",
  "data": {
    "payment": { ... },
    "order": { "status": "PROCESSING", ... }
  }
}
```

### Tracking Pesanan Guest

```json
GET /orders/guest/track/:orderId

Response:
{
  "success": true,
  "message": "Status pesanan berhasil diambil",
  "data": {
    "orderId": "uuid",
    "guestName": "Budi",
    "status": "PROCESSING",
    "totalPrice": 25000,
    "orderItems": [...],
    "payment": { ... }
  }
}
```

### Reorder (Pesan Ulang)

```json
POST /orders/:id/reorder
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "message": "Order berhasil dibuat",
  "data": {
    "id": "uuid-order-baru",
    "totalPrice": 35000,
    "status": "PENDING",
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
umume
```

---

## 👨‍💻 Developer

| Role               | Nama    |
| ------------------ | ------- |
| Backend Developer  | Fahry   |
| Frontend Developer | (Dzaky) |

**Sekolah:** SMK Telkom Malang  
**Kelas:** XI  
**Tahun:** 2026

---

> Dibuat dengan ❤️ untuk Ujian Kenaikan Level SMK Telkom Malang
