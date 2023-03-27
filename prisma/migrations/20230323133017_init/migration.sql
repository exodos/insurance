-- AlterTable
ALTER TABLE "ThirdPartyLog" ADD COLUMN     "claimHitAndRunId" TEXT;

-- AddForeignKey
ALTER TABLE "ThirdPartyLog" ADD CONSTRAINT "ThirdPartyLog_claimHitAndRunId_fkey" FOREIGN KEY ("claimHitAndRunId") REFERENCES "ClaimHitAndRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
