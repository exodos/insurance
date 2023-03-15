/*
  Warnings:

  - You are about to drop the column `refNumber` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `refNumber` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_refNumber_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_refNumber_fkey";

-- DropIndex
DROP INDEX "Payment_refNumber_key";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "refNumber",
ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "refNumber",
ADD COLUMN     "paymentId" TEXT;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
