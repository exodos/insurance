/*
  Warnings:

  - You are about to drop the `_AccidentRecordToClaim` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `claimNumber` to the `AccidentRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AccidentRecordToClaim" DROP CONSTRAINT "_AccidentRecordToClaim_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccidentRecordToClaim" DROP CONSTRAINT "_AccidentRecordToClaim_B_fkey";

-- AlterTable
ALTER TABLE "AccidentRecord" ADD COLUMN     "claimNumber" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AccidentRecordToClaim";

-- AddForeignKey
ALTER TABLE "AccidentRecord" ADD CONSTRAINT "AccidentRecord_claimNumber_fkey" FOREIGN KEY ("claimNumber") REFERENCES "Claim"("claimNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
