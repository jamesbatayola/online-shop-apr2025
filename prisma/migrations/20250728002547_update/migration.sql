/*
  Warnings:

  - Added the required column `items` to the `Checkout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('on_process', 'delivered');

-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "items" INTEGER NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "PasswordResetToken" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + interval '15 minutes';
