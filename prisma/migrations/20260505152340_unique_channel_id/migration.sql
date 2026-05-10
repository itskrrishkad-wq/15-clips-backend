/*
  Warnings:

  - A unique constraint covering the columns `[channelId]` on the table `Source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Source_channelId_key" ON "Source"("channelId");
