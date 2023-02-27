/*
  Warnings:

  - You are about to drop the `_CertificateRecordToInsured` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CertificateRecordToInsured" DROP CONSTRAINT "_CertificateRecordToInsured_A_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateRecordToInsured" DROP CONSTRAINT "_CertificateRecordToInsured_B_fkey";

-- DropTable
DROP TABLE "_CertificateRecordToInsured";
