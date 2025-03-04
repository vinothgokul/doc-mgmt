-- CreateTable
CREATE TABLE "IngestionProcess" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngestionProcess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IngestionProcess" ADD CONSTRAINT "IngestionProcess_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
