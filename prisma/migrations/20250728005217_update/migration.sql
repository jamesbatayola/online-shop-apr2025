/*
  Warnings:

  - You are about to drop the column `items` on the `Checkout` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Checkout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "items",
DROP COLUMN "price",
ADD COLUMN     "status" "CheckoutStatus" NOT NULL DEFAULT 'on_process';

-- AlterTable
ALTER TABLE "PasswordResetToken" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + interval '15 minutes';
