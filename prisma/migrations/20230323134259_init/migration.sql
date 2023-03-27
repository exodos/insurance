-- AlterTable
ALTER TABLE "ThirdPartyLog" ADD COLUMN     "hitAndRunPoliceReportId" TEXT;

-- AddForeignKey
ALTER TABLE "ThirdPartyLog" ADD CONSTRAINT "ThirdPartyLog_hitAndRunPoliceReportId_fkey" FOREIGN KEY ("hitAndRunPoliceReportId") REFERENCES "HitAndRunPoliceReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
