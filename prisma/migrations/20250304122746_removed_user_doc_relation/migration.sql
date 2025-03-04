/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Document` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_ownerId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "ownerId";
