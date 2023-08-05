/*
  Warnings:

  - You are about to drop the column `mobileNumber` on the `Organization` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Organization_mobileNumber_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "mobileNumber";
