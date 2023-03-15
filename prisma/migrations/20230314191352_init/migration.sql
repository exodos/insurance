/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refNumber]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_paymentId_fkey";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "paymentId",
ADD COLUMN     "refNumber" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "paymentId",
ADD COLUMN     "refNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_refNumber_key" ON "Payment"("refNumber");

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;
