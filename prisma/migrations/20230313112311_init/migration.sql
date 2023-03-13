/*
  Warnings:

  - Added the required column `certificateNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plateNumber` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_refNumber_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "certificateNumber" TEXT NOT NULL,
ADD COLUMN     "plateNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_plateNumber_fkey" FOREIGN KEY ("plateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_certificateNumber_fkey" FOREIGN KEY ("certificateNumber") REFERENCES "Certificate"("certificateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
