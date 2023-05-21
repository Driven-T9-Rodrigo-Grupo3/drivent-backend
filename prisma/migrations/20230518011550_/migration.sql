-- CreateTable
CREATE TABLE "PaymentData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "url" VARCHAR(511) NOT NULL,

    CONSTRAINT "PaymentData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentData_userId_key" ON "PaymentData"("userId");

-- AddForeignKey
ALTER TABLE "PaymentData" ADD CONSTRAINT "PaymentData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
