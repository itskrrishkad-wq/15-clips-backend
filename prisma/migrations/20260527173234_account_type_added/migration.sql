-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('GOOGLE', 'EMAIL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'EMAIL';
