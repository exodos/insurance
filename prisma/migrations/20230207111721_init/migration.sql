/*
  Warnings:

  - Added the required column `passengerNumber` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "passengerNumber",
ADD COLUMN     "passengerNumber" INTEGER NOT NULL;
