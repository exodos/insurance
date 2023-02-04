/*
  Warnings:

  - Made the column `branchId` on table `Insured` required. This step will fail if there are existing NULL values in that column.
  - Made the column `insuredId` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Insured" DROP CONSTRAINT "Insured_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_insuredId_fkey";

-- AlterTable
ALTER TABLE "Insured" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "occupation" TEXT,
ALTER COLUMN "insuredName" DROP NOT NULL,
ALTER COLUMN "branchId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "insuredId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Insured" ADD CONSTRAINT "Insured_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_insuredId_fkey" FOREIGN KEY ("insuredId") REFERENCES "Insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
