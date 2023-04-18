/*
  Warnings:

  - The values [Payed] on the enum `ClaimPaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Payed] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `branch_id` on the `third_party_log` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ClaimPaymentStatus_new" AS ENUM ('Paid', 'Pending');
ALTER TYPE "ClaimPaymentStatus" RENAME TO "ClaimPaymentStatus_old";
ALTER TYPE "ClaimPaymentStatus_new" RENAME TO "ClaimPaymentStatus";
DROP TYPE "ClaimPaymentStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('Paid', 'PendingPayment', 'PendingApproval');
ALTER TABLE "payment" ALTER COLUMN "payment_status" DROP DEFAULT;
ALTER TABLE "payment" ALTER COLUMN "payment_status" TYPE "PaymentStatus_new" USING ("payment_status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "payment" ALTER COLUMN "payment_status" SET DEFAULT 'PendingApproval';
COMMIT;

-- AlterTable
ALTER TABLE "third_party_log" DROP COLUMN "branch_id";
