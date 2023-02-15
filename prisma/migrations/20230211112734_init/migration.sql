/*
  Warnings:

  - You are about to drop the column `propertyInjusryAmount` on the `AccidentRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccidentRecord" DROP COLUMN "propertyInjusryAmount",
ADD COLUMN     "propertyInjuryAmount" DOUBLE PRECISION;
