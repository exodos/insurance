/*
  Warnings:

  - You are about to drop the column `deleted` on the `Insured` table. All the data in the column will be lost.
  - You are about to drop the column `deletedTime` on the `Insured` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Insured" DROP COLUMN "deleted",
DROP COLUMN "deletedTime";
