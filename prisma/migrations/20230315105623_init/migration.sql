/*
  Warnings:

  - You are about to drop the column `claimRefNumber` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `refNumber` on the `Certificate` table. All the data in the column will be lost.
  - You are about to drop the column `claimRefNumber` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `refNumber` on the `Vehicle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_claimRefNumber_fkey";

-- DropForeignKey
ALTER TABLE "Certificate" DROP CONSTRAINT "Certificate_refNumber_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_regNumber_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_claimRefNumber_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_refNumber_fkey";

-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "claimRefNumber",
DROP COLUMN "refNumber";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "regNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "claimRefNumber",
DROP COLUMN "refNumber";

-- CreateTable
CREATE TABLE "_CertificateToPayment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateToClaimPayment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PaymentToVehicle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClaimPaymentToVehicle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToPayment_AB_unique" ON "_CertificateToPayment"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToPayment_B_index" ON "_CertificateToPayment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToClaimPayment_AB_unique" ON "_CertificateToClaimPayment"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToClaimPayment_B_index" ON "_CertificateToClaimPayment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PaymentToVehicle_AB_unique" ON "_PaymentToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_PaymentToVehicle_B_index" ON "_PaymentToVehicle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClaimPaymentToVehicle_AB_unique" ON "_ClaimPaymentToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_ClaimPaymentToVehicle_B_index" ON "_ClaimPaymentToVehicle"("B");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_regNumber_fkey" FOREIGN KEY ("regNumber") REFERENCES "Insured"("regNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToPayment" ADD CONSTRAINT "_CertificateToPayment_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToPayment" ADD CONSTRAINT "_CertificateToPayment_B_fkey" FOREIGN KEY ("B") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToClaimPayment" ADD CONSTRAINT "_CertificateToClaimPayment_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToClaimPayment" ADD CONSTRAINT "_CertificateToClaimPayment_B_fkey" FOREIGN KEY ("B") REFERENCES "ClaimPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToVehicle" ADD CONSTRAINT "_PaymentToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToVehicle" ADD CONSTRAINT "_PaymentToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimPaymentToVehicle" ADD CONSTRAINT "_ClaimPaymentToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "ClaimPayment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimPaymentToVehicle" ADD CONSTRAINT "_ClaimPaymentToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
