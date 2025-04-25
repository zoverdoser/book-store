-- CreateTable
CREATE TABLE "BookDownload" (
    "id" SERIAL NOT NULL,
    "bookId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookDownload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookDownload_bookId_idx" ON "BookDownload"("bookId");

-- CreateIndex
CREATE INDEX "BookDownload_userId_idx" ON "BookDownload"("userId");

-- AddForeignKey
ALTER TABLE "BookDownload" ADD CONSTRAINT "BookDownload_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookDownload" ADD CONSTRAINT "BookDownload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
