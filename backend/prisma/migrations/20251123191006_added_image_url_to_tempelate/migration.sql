/*
  Warnings:

  - Added the required column `imageUrl` to the `Tempelate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tempelate" ADD COLUMN     "imageUrl" TEXT NOT NULL;
