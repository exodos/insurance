/*
  Warnings:

  - The `manufacturedYear` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `purchasedYear` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "manufacturedYear",
ADD COLUMN     "manufacturedYear" INTEGER,
DROP COLUMN "purchasedYear",
ADD COLUMN     "purchasedYear" INTEGER;
