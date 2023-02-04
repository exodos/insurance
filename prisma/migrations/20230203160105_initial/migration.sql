-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "dutyFreeValue" DOUBLE PRECISION,
ADD COLUMN     "dutyPaidValue" DOUBLE PRECISION,
ADD COLUMN     "horsePower" TEXT,
ADD COLUMN     "manufacturedYear" TIMESTAMP(3),
ADD COLUMN     "passengerNumber" INTEGER,
ADD COLUMN     "purchasedYear" TIMESTAMP(3),
ADD COLUMN     "vehicleDetails" TEXT,
ADD COLUMN     "vehicleModel" TEXT,
ADD COLUMN     "vehicleSubType" TEXT,
ADD COLUMN     "vehicleUsage" TEXT;
