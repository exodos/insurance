/*
  Warnings:

  - The values [SUSPENDED] on the enum `InsuranceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InsuranceStatus_new" AS ENUM ('APPROVED', 'PendingPayment', 'PendingApproval');
ALTER TABLE "Certificate" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Certificate" ALTER COLUMN "status" TYPE "InsuranceStatus_new" USING ("status"::text::"InsuranceStatus_new");
ALTER TYPE "InsuranceStatus" RENAME TO "InsuranceStatus_old";
ALTER TYPE "InsuranceStatus_new" RENAME TO "InsuranceStatus";
DROP TYPE "InsuranceStatus_old";
ALTER TABLE "Certificate" ALTER COLUMN "status" SET DEFAULT 'PendingApproval';
COMMIT;

-- AlterTable
ALTER TABLE "Certificate" ALTER COLUMN "status" SET DEFAULT 'PendingApproval';
