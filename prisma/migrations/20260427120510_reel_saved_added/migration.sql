-- CreateTable
CREATE TABLE "ReelSaved" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reelId" TEXT NOT NULL,
    "Saved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReelSaved_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReelSaved_reelId_idx" ON "ReelSaved"("reelId");

-- CreateIndex
CREATE UNIQUE INDEX "ReelSaved_userId_reelId_key" ON "ReelSaved"("userId", "reelId");

-- AddForeignKey
ALTER TABLE "ReelSaved" ADD CONSTRAINT "ReelSaved_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReelSaved" ADD CONSTRAINT "ReelSaved_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
