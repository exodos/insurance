/*
  Warnings:

  - Made the column `regNumber` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plateNumber` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `certificateNumber` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ClaimPaymentStatus" AS ENUM ('Payed', 'Pending');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_certificateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_plateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_regNumber_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "regNumber" SET NOT NULL,
ALTER COLUMN "plateNumber" SET NOT NULL,
ALTER COLUMN "certificateNumber" SET NOT NULL;

-- CreateTable
CREATE TABLE "ClaimPayment" (
    "id" TEXT NOT NULL,
    "refNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "ClaimPaymentStatus" NOT NULL DEFAULT 'Pending',
    "regNumber" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "deletedStatus" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClaimPayment_refNumber_key" ON "ClaimPayment"("refNumber");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_regNumber_fkey" FOREIGN KEY ("regNumber") REFERENCES "Insured"("regNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_plateNumber_fkey" FOREIGN KEY ("plateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_certificateNumber_fkey" FOREIGN KEY ("certificateNumber") REFERENCES "Certificate"("certificateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimPayment" ADD CONSTRAINT "ClaimPayment_regNumber_fkey" FOREIGN KEY ("regNumber") REFERENCES "Insured"("regNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimPayment" ADD CONSTRAINT "ClaimPayment_plateNumber_fkey" FOREIGN KEY ("plateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimPayment" ADD CONSTRAINT "ClaimPayment_certificateNumber_fkey" FOREIGN KEY ("certificateNumber") REFERENCES "Certificate"("certificateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
