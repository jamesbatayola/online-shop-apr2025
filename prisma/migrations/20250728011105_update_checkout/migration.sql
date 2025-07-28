/*
  Warnings:

  - Added the required column `user_id` to the `Checkout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checkout" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PasswordResetToken" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + interval '15 minutes';

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
