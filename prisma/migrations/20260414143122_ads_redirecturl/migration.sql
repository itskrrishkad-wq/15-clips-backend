-- AlterEnum
ALTER TYPE "AdminUserRole" ADD VALUE 'GUEST';

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN     "redirectUrl" TEXT;
