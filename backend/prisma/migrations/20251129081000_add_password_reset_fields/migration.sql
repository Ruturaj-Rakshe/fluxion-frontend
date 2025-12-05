/*
  Warnings:

  - You are about to drop the column `paymentConfirmetAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `DownloadLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DownloadLink" DROP CONSTRAINT "DownloadLink_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentConfirmetAt";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- DropTable
DROP TABLE "DownloadLink";
