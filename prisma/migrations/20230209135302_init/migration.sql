/*
  Warnings:

  - A unique constraint covering the columns `[regNumber]` on the table `Insured` will be added. If there are existing duplicate values, this will fail.
  - Made the column `regNumber` on table `Insured` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Insured" ALTER COLUMN "regNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Insured_regNumber_key" ON "Insured"("regNumber");
