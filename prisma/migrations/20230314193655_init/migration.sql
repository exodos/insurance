/*
  Warnings:

  - Made the column `refNumber` on table `Certificate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refNumber` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_refNumber_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_refNumber_fkey";

-- AlterTable
ALTER TABLE "Certificate" ALTER COLUMN "refNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "refNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
