-- AlterTable
ALTER TABLE "ThirdPartyLog" ADD COLUMN     "unInsuredPoliceReportId" TEXT;

-- AddForeignKey
ALTER TABLE "ThirdPartyLog" ADD CONSTRAINT "ThirdPartyLog_unInsuredPoliceReportId_fkey" FOREIGN KEY ("unInsuredPoliceReportId") REFERENCES "UnInsuredPoliceReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
