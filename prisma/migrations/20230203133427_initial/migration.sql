/*
  Warnings:

  - You are about to drop the column `tariffCode` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `tariffCode` on the `Tariff` table. All the data in the column will be lost.
  - You are about to drop the column `usage` on the `Tariff` table. All the data in the column will be lost.
  - Added the required column `vehicleUsage` to the `Tariff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_tariffCode_fkey";

-- DropIndex
DROP INDEX "Tariff_tariffCode_key";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "tariffCode";

-- AlterTable
ALTER TABLE "Tariff" DROP COLUMN "tariffCode",
DROP COLUMN "usage",
ADD COLUMN     "vehicleUsage" TEXT NOT NULL;
