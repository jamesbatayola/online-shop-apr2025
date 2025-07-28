/*
  Warnings:

  - You are about to drop the column `product_id` on the `Checkout` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_product_id_fkey";

-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "product_id",
ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "PasswordResetToken" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + interval '15 minutes';

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
