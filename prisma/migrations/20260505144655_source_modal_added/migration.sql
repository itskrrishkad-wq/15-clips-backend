-- CreateEnum
CREATE TYPE "SourceValue" AS ENUM ('YOUTUBE', 'INSTAGRAM');

-- AlterEnum
ALTER TYPE "ReportReason" ADD VALUE 'COPYRIGHT';

-- AlterTable
ALTER TABLE "Reel" ADD COLUMN     "channel" TEXT,
ADD COLUMN     "channelId" TEXT,
ADD COLUMN     "thumbnail" TEXT;

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "categories" TEXT[],
    "language" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "source" "SourceValue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);
