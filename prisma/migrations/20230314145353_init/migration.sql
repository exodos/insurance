/*
  Warnings:

  - You are about to drop the column `certificateNumber` on the `ClaimPayment` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `ClaimPayment` table. All the data in the column will be lost.
  - You are about to drop the column `regNumber` on the `ClaimPayment` table. All the data in the column will be lost.
  - You are about to drop the column `certificateNumber` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `regNumber` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClaimPayment" DROP CONSTRAINT "ClaimPayment_certificateNumber_fkey";

-- DropForeignKey
ALTER TABLE "ClaimPayment" DROP CONSTRAINT "ClaimPayment_plateNumber_fkey";

-- DropForeignKey
ALTER TABLE "ClaimPayment" DROP CONSTRAINT "ClaimPayment_regNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_certificateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_plateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_regNumber_fkey";

-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "claimRefNumber" TEXT,
ADD COLUMN     "refNumber" TEXT;

-- AlterTable
ALTER TABLE "ClaimPayment" DROP COLUMN "certificateNumber",
DROP COLUMN "plateNumber",
DROP COLUMN "regNumber";

-- AlterTable
ALTER TABLE "Insured" ADD COLUMN     "claimRefNumber" TEXT,
ADD COLUMN     "refNumber" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "certificateNumber",
DROP COLUMN "plateNumber",
DROP COLUMN "regNumber";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "claimRefNumber" TEXT,
ADD COLUMN     "refNumber" TEXT;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_claimRefNumber_fkey" FOREIGN KEY ("claimRefNumber") REFERENCES "ClaimPayment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insured" ADD CONSTRAINT "Insured_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insured" ADD CONSTRAINT "Insured_claimRefNumber_fkey" FOREIGN KEY ("claimRefNumber") REFERENCES "ClaimPayment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_claimRefNumber_fkey" FOREIGN KEY ("claimRefNumber") REFERENCES "ClaimPayment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;
