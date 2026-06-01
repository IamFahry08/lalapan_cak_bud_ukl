-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;
