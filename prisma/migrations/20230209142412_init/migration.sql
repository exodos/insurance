-- DropForeignKey
ALTER TABLE "AccidentRecord" DROP CONSTRAINT "AccidentRecord_plateNumber_fkey";

-- AddForeignKey
ALTER TABLE "AccidentRecord" ADD CONSTRAINT "AccidentRecord_plateNumber_fkey" FOREIGN KEY ("plateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
