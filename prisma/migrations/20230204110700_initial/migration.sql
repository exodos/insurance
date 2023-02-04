/*
  Warnings:

  - You are about to drop the column `carryingCapacityInPersons` on the `Vehicle` table. All the data in the column will be lost.
  - Made the column `bodyType` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dutyFreeValue` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dutyPaidValue` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `horsePower` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `passengerNumber` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicleDetails` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicleModel` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicleSubType` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vehicleUsage` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `manufacturedYear` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `purchasedYear` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "carryingCapacityInPersons",
ALTER COLUMN "carryingCapacityInGoods" DROP NOT NULL,
ALTER COLUMN "bodyType" SET NOT NULL,
ALTER COLUMN "dutyFreeValue" SET NOT NULL,
ALTER COLUMN "dutyPaidValue" SET NOT NULL,
ALTER COLUMN "horsePower" SET NOT NULL,
ALTER COLUMN "passengerNumber" SET NOT NULL,
ALTER COLUMN "vehicleDetails" SET NOT NULL,
ALTER COLUMN "vehicleModel" SET NOT NULL,
ALTER COLUMN "vehicleSubType" SET NOT NULL,
ALTER COLUMN "vehicleUsage" SET NOT NULL,
ALTER COLUMN "manufacturedYear" SET NOT NULL,
ALTER COLUMN "purchasedYear" SET NOT NULL;
