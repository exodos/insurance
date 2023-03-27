-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_vehiclePlateNumber_fkey";

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_vehiclePlateNumber_fkey" FOREIGN KEY ("vehiclePlateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
