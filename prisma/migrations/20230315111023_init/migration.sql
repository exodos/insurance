/*
  Warnings:

  - You are about to drop the `_ClaimPaymentToVehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PaymentToVehicle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClaimPaymentToVehicle" DROP CONSTRAINT "_ClaimPaymentToVehicle_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClaimPaymentToVehicle" DROP CONSTRAINT "_ClaimPaymentToVehicle_B_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToVehicle" DROP CONSTRAINT "_PaymentToVehicle_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaymentToVehicle" DROP CONSTRAINT "_PaymentToVehicle_B_fkey";

-- DropTable
DROP TABLE "_ClaimPaymentToVehicle";

-- DropTable
DROP TABLE "_PaymentToVehicle";
