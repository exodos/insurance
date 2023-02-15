/*
  Warnings:

  - You are about to drop the column `claimId` on the `AccidentRecord` table. All the data in the column will be lost.
  - Added the required column `claimNumber` to the `AccidentRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccidentRecord" DROP CONSTRAINT "AccidentRecord_claimId_fkey";

-- AlterTable
ALTER TABLE "AccidentRecord" DROP COLUMN "claimId",
ADD COLUMN     "claimNumber" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AccidentRecord" ADD CONSTRAINT "AccidentRecord_claimNumber_fkey" FOREIGN KEY ("claimNumber") REFERENCES "Claim"("claimNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
