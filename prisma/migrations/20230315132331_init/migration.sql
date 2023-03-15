/*
  Warnings:

  - You are about to drop the column `refNumber` on the `Insured` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Insured" DROP CONSTRAINT "Insured_refNumber_fkey";

-- AlterTable
ALTER TABLE "Insured" DROP COLUMN "refNumber";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "insuredId" TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_insuredId_fkey" FOREIGN KEY ("insuredId") REFERENCES "Insured"("id") ON DELETE SET NULL ON UPDATE CASCADE;
