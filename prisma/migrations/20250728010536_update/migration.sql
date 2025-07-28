/*
  Warnings:

  - Added the required column `price` to the `CheckoutItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `CheckoutItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CheckoutItem" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PasswordResetToken" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + interval '15 minutes';
