/*
  Warnings:

  - You are about to drop the column `branchName` on the `third_party_log` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "third_party_log" DROP CONSTRAINT "third_party_log_branch_id_fkey";

-- AlterTable
ALTER TABLE "third_party_log" DROP COLUMN "branchName",
ADD COLUMN     "branch_name" TEXT;

-- AddForeignKey
ALTER TABLE "third_party_log" ADD CONSTRAINT "third_party_log_branch_name_fkey" FOREIGN KEY ("branch_name") REFERENCES "branch"("branch_name") ON DELETE SET NULL ON UPDATE CASCADE;
