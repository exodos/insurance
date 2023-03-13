-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedStatus" BOOLEAN NOT NULL DEFAULT false;
