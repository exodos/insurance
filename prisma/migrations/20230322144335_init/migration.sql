/*
  Warnings:

  - You are about to drop the column `orgName` on the `ThirdPartyLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ThirdPartyLog" DROP COLUMN "orgName",
ADD COLUMN     "branchId" TEXT;

-- AddForeignKey
ALTER TABLE "ThirdPartyLog" ADD CONSTRAINT "ThirdPartyLog_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
