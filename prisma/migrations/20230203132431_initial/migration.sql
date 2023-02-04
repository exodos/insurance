/*
  Warnings:

  - You are about to drop the `TariffDetal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TariffDetal";

-- CreateTable
CREATE TABLE "TariffDetails" (
    "id" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleSubType" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "vehicleDetail" TEXT NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TariffDetails_pkey" PRIMARY KEY ("id")
);
