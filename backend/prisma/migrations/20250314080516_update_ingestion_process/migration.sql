/*
  Warnings:

  - You are about to drop the column `updatedat` on the `IngestionProcess` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[documentId]` on the table `IngestionProcess` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "IngestionProcess" DROP COLUMN "updatedat";

-- CreateIndex
CREATE UNIQUE INDEX "IngestionProcess_documentId_key" ON "IngestionProcess"("documentId");
