/*
  Warnings:

  - Made the column `insuredId` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `branchCode` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_branchCode_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_insuredId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "insuredId" SET NOT NULL,
ALTER COLUMN "branchCode" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_insuredId_fkey" FOREIGN KEY ("insuredId") REFERENCES "Insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE RESTRICT ON UPDATE CASCADE;
