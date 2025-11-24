/*
  Warnings:

  - You are about to alter the column `title` on the `Tempelate` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `thumbnailUrl` on the `Tempelate` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `imageUrl` on the `Tempelate` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - A unique constraint covering the columns `[userId,tempelateId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_tempelateId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- AlterTable
ALTER TABLE "Tempelate" ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "thumbnailUrl" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "imageUrl" SET DATA TYPE VARCHAR(500);

-- CreateTable
CREATE TABLE "TempelateDetail" (
    "id" TEXT NOT NULL,
    "tempelateId" TEXT NOT NULL,
    "header" VARCHAR(300) NOT NULL,
    "headerSubtitle" VARCHAR(500) NOT NULL,
    "features" TEXT[],
    "benefits" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempelateDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempelateDetail_tempelateId_key" ON "TempelateDetail"("tempelateId");

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "Cart_tempelateId_idx" ON "Cart"("tempelateId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_tempelateId_key" ON "Cart"("userId", "tempelateId");

-- CreateIndex
CREATE INDEX "Tempelate_isActive_idx" ON "Tempelate"("isActive");

-- CreateIndex
CREATE INDEX "Tempelate_price_idx" ON "Tempelate"("price");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TempelateDetail" ADD CONSTRAINT "TempelateDetail_tempelateId_fkey" FOREIGN KEY ("tempelateId") REFERENCES "Tempelate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_tempelateId_fkey" FOREIGN KEY ("tempelateId") REFERENCES "Tempelate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
