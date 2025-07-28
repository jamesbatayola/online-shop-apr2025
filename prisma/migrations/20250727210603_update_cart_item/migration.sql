-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PasswordResetToken" ALTER COLUMN "expires_at" SET DEFAULT CURRENT_TIMESTAMP + interval '15 minutes';
