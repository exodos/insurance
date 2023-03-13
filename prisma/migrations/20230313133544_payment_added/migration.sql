/*
  Warnings:

  - You are about to drop the column `regNumber` on the `Payment` table. All the data in the column will be lost.
  - Made the column `certificateNumber` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `plateNumber` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_certificateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_plateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_regNumber_fkey";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "regNumber",
ALTER COLUMN "certificateNumber" SET NOT NULL,
ALTER COLUMN "plateNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_plateNumber_fkey" FOREIGN KEY ("plateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_certificateNumber_fkey" FOREIGN KEY ("certificateNumber") REFERENCES "Certificate"("certificateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
