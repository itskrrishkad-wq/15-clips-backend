/*
  Warnings:

  - You are about to drop the column `sourceLikee` on the `Reel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reel" DROP COLUMN "sourceLikee",
ADD COLUMN     "sourceLikes" INTEGER DEFAULT 0;
