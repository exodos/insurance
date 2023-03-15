/*
  Warnings:

  - You are about to drop the column `claimRefNumber` on the `Insured` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Insured" DROP CONSTRAINT "Insured_claimRefNumber_fkey";

-- AlterTable
ALTER TABLE "ClaimPayment" ADD COLUMN     "regNumber" TEXT;

-- AlterTable
ALTER TABLE "Insured" DROP COLUMN "claimRefNumber";

-- AddForeignKey
ALTER TABLE "ClaimPayment" ADD CONSTRAINT "ClaimPayment_regNumber_fkey" FOREIGN KEY ("regNumber") REFERENCES "Insured"("regNumber") ON DELETE SET NULL ON UPDATE CASCADE;
