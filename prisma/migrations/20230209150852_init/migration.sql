-- CreateEnum
CREATE TYPE "ClaimProgress" AS ENUM ('OnProgress', 'Completed');

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "claimStatus" "ClaimProgress";
