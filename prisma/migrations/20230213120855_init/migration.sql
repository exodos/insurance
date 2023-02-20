-- CreateTable
CREATE TABLE "CertificateRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertificateRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BranchToCertificateRecord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateToCertificateRecord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateRecordToPolicy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateRecordToInsured" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateRecordToVehicle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToCertificateRecord_AB_unique" ON "_BranchToCertificateRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToCertificateRecord_B_index" ON "_BranchToCertificateRecord"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToCertificateRecord_AB_unique" ON "_CertificateToCertificateRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToCertificateRecord_B_index" ON "_CertificateToCertificateRecord"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateRecordToPolicy_AB_unique" ON "_CertificateRecordToPolicy"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateRecordToPolicy_B_index" ON "_CertificateRecordToPolicy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateRecordToInsured_AB_unique" ON "_CertificateRecordToInsured"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateRecordToInsured_B_index" ON "_CertificateRecordToInsured"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateRecordToVehicle_AB_unique" ON "_CertificateRecordToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateRecordToVehicle_B_index" ON "_CertificateRecordToVehicle"("B");

-- AddForeignKey
ALTER TABLE "_BranchToCertificateRecord" ADD CONSTRAINT "_BranchToCertificateRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToCertificateRecord" ADD CONSTRAINT "_BranchToCertificateRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "CertificateRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToCertificateRecord" ADD CONSTRAINT "_CertificateToCertificateRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToCertificateRecord" ADD CONSTRAINT "_CertificateToCertificateRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "CertificateRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToPolicy" ADD CONSTRAINT "_CertificateRecordToPolicy_A_fkey" FOREIGN KEY ("A") REFERENCES "CertificateRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToPolicy" ADD CONSTRAINT "_CertificateRecordToPolicy_B_fkey" FOREIGN KEY ("B") REFERENCES "Policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToInsured" ADD CONSTRAINT "_CertificateRecordToInsured_A_fkey" FOREIGN KEY ("A") REFERENCES "CertificateRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToInsured" ADD CONSTRAINT "_CertificateRecordToInsured_B_fkey" FOREIGN KEY ("B") REFERENCES "Insured"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToVehicle" ADD CONSTRAINT "_CertificateRecordToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "CertificateRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToVehicle" ADD CONSTRAINT "_CertificateRecordToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
