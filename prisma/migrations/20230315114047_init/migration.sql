/*
  Warnings:

  - You are about to drop the `ClaimPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CertificateToClaimPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClaimPayment" DROP CONSTRAINT "ClaimPayment_regNumber_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateToClaimPayment" DROP CONSTRAINT "_CertificateToClaimPayment_A_fkey";

-- DropForeignKey
ALTER TABLE "_CertificateToClaimPayment" DROP CONSTRAINT "_CertificateToClaimPayment_B_fkey";

-- DropTable
DROP TABLE "ClaimPayment";

-- DropTable
DROP TABLE "_CertificateToClaimPayment";
