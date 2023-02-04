/*
  Warnings:

  - You are about to drop the column `insuredName` on the `Insured` table. All the data in the column will be lost.
  - Made the column `firstName` on table `Insured` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Insured` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Insured" DROP COLUMN "insuredName",
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;
