/*
  Warnings:

  - You are about to drop the column `typeOfAccident` on the `AccidentRecord` table. All the data in the column will be lost.
  - You are about to drop the column `accidentRecordId` on the `InsuredPoliceReport` table. All the data in the column will be lost.
  - Added the required column `accidentType` to the `AccidentRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "InsuredPoliceReport" DROP CONSTRAINT "InsuredPoliceReport_accidentRecordId_fkey";

-- AlterTable
ALTER TABLE "AccidentRecord" DROP COLUMN "typeOfAccident",
ADD COLUMN     "accidentType" "ACCIDENTTYPE" NOT NULL,
ADD COLUMN     "propertyInjusryAmount" DOUBLE PRECISION,
ALTER COLUMN "accidentSubType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InsuredPoliceReport" DROP COLUMN "accidentRecordId";

-- CreateTable
CREATE TABLE "_AccidentRecordToClaim" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccidentRecordToClaim_AB_unique" ON "_AccidentRecordToClaim"("A", "B");

-- CreateIndex
CREATE INDEX "_AccidentRecordToClaim_B_index" ON "_AccidentRecordToClaim"("B");

-- AddForeignKey
ALTER TABLE "_AccidentRecordToClaim" ADD CONSTRAINT "_AccidentRecordToClaim_A_fkey" FOREIGN KEY ("A") REFERENCES "AccidentRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccidentRecordToClaim" ADD CONSTRAINT "_AccidentRecordToClaim_B_fkey" FOREIGN KEY ("B") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;
