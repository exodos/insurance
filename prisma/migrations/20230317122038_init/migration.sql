-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "branchCode" TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_branchCode_fkey" FOREIGN KEY ("branchCode") REFERENCES "Branch"("branchCode") ON DELETE SET NULL ON UPDATE CASCADE;
