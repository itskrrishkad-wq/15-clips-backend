-- CreateTable
CREATE TABLE "ReelLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reelId" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "gender" TEXT,
    "age" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReelLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReelLike_reelId_idx" ON "ReelLike"("reelId");

-- CreateIndex
CREATE UNIQUE INDEX "ReelLike_userId_reelId_key" ON "ReelLike"("userId", "reelId");

-- AddForeignKey
ALTER TABLE "ReelLike" ADD CONSTRAINT "ReelLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReelLike" ADD CONSTRAINT "ReelLike_reelId_fkey" FOREIGN KEY ("reelId") REFERENCES "Reel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
