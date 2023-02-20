/*
  Warnings:

  - You are about to drop the column `accidentSubType` on the `AccidentRecord` table. All the data in the column will be lost.
  - You are about to drop the column `accidentTypes` on the `AccidentRecord` table. All the data in the column will be lost.
  - You are about to drop the column `propertyInjuryAmount` on the `AccidentRecord` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ACCIDENTSUBTYPE" AS ENUM ('SlightBodilyInjury', 'SaviorBodilyInjury', 'Death');

-- AlterTable
ALTER TABLE "AccidentRecord" DROP COLUMN "accidentSubType",
DROP COLUMN "accidentTypes",
DROP COLUMN "propertyInjuryAmount",
ADD COLUMN     "bodilyInjury" "ACCIDENTSUBTYPE",
ADD COLUMN     "propertyInjury" DOUBLE PRECISION;

-- DropEnum
DROP TYPE "ACCIDENTTYPE";
