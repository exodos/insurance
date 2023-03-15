-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_certificateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_plateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_regNumber_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "regNumber" DROP NOT NULL,
ALTER COLUMN "plateNumber" DROP NOT NULL,
ALTER COLUMN "certificateNumber" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_regNumber_fkey" FOREIGN KEY ("regNumber") REFERENCES "Insured"("regNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_plateNumber_fkey" FOREIGN KEY ("plateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_certificateNumber_fkey" FOREIGN KEY ("certificateNumber") REFERENCES "Certificate"("certificateNumber") ON DELETE SET NULL ON UPDATE CASCADE;
