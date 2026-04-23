/*
  Warnings:

  - You are about to drop the column `profession` on the `Ad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "profession",
ADD COLUMN     "professions" TEXT[];
