/*
  Warnings:

  - You are about to drop the column `regNumber` on the `Payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_regNumber_fkey";

-- AlterTable
ALTER TABLE "Insured" ADD COLUMN     "refNumber" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "regNumber";

-- AddForeignKey
ALTER TABLE "Insured" ADD CONSTRAINT "Insured_refNumber_fkey" FOREIGN KEY ("refNumber") REFERENCES "Payment"("refNumber") ON DELETE SET NULL ON UPDATE CASCADE;
