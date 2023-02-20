/*
  Warnings:

  - You are about to drop the column `claimNumber` on the `AccidentRecord` table. All the data in the column will be lost.
  - Added the required column `claimId` to the `AccidentRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccidentRecord" DROP CONSTRAINT "AccidentRecord_claimNumber_fkey";

-- AlterTable
ALTER TABLE "AccidentRecord" DROP COLUMN "claimNumber",
ADD COLUMN     "claimId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AccidentRecord" ADD CONSTRAINT "AccidentRecord_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
