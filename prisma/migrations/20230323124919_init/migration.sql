-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_vehiclePlateNumber_fkey";

-- AlterTable
ALTER TABLE "Certificate" ALTER COLUMN "vehiclePlateNumber" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_vehiclePlateNumber_fkey" FOREIGN KEY ("vehiclePlateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE SET NULL ON UPDATE CASCADE;
