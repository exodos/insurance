/*
  Warnings:

  - You are about to drop the column `accidentType` on the `AccidentRecord` table. All the data in the column will be lost.
  - Added the required column `accidentTypes` to the `AccidentRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AccidentRecord" DROP COLUMN "accidentType",
ADD COLUMN     "accidentTypes" "ACCIDENTTYPE" NOT NULL;
