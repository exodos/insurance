/*
  Warnings:

  - Made the column `claimStatus` on table `Claim` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Claim" ALTER COLUMN "claimStatus" SET NOT NULL,
ALTER COLUMN "claimStatus" SET DEFAULT 'OnProgress';
