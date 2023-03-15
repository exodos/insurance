/*
  Warnings:

  - Made the column `regNumber` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_regNumber_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "regNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_regNumber_fkey" FOREIGN KEY ("regNumber") REFERENCES "Insured"("regNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
