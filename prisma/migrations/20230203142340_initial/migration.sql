/*
  Warnings:

  - You are about to drop the column `insuredMobileNumber` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `claimantMobileNumber` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `insuredMobileNumber` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `_insuredToBranch` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `insuredId` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `claimantId` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_insuredMobileNumber_fkey";

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_claimantMobileNumber_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_insuredMobileNumber_fkey";

-- DropForeignKey
ALTER TABLE "_insuredToBranch" DROP CONSTRAINT "_insuredToBranch_A_fkey";

-- DropForeignKey
ALTER TABLE "_insuredToBranch" DROP CONSTRAINT "_insuredToBranch_B_fkey";

-- DropIndex
DROP INDEX "Insured_mobileNumber_key";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "insuredMobileNumber",
ADD COLUMN     "insuredId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "claimantMobileNumber",
ADD COLUMN     "claimantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Insured" ADD COLUMN     "branchId" TEXT;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "insuredMobileNumber",
ADD COLUMN     "insuredId" TEXT;

-- DropTable
DROP TABLE "_insuredToBranch";

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_insuredId_fkey" FOREIGN KEY ("insuredId") REFERENCES "Insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Insured" ADD CONSTRAINT "Insured_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_insuredId_fkey" FOREIGN KEY ("insuredId") REFERENCES "Insured"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_claimantId_fkey" FOREIGN KEY ("claimantId") REFERENCES "Insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
