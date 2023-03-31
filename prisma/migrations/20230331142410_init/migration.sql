-- CreateEnum
CREATE TYPE "InsuranceStatus" AS ENUM ('APPROVED', 'PendingPayment', 'PendingApproval');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Payed', 'PendingPayment', 'PendingApproval');

-- CreateEnum
CREATE TYPE "ClaimPaymentStatus" AS ENUM ('Payed', 'Pending');

-- CreateEnum
CREATE TYPE "CommissioningStatus" AS ENUM ('Commissioned', 'NotCommissioned');

-- CreateEnum
CREATE TYPE "ACCIDENTSUBTYPE" AS ENUM ('SlightBodilyInjury', 'SaviorBodilyInjury', 'Death');

-- CreateEnum
CREATE TYPE "VEHICLESTATUS" AS ENUM ('NEW', 'RENEWAL', 'ADDITIONAL');

-- CreateEnum
CREATE TYPE "PaymentFor" AS ENUM ('THIRDPARTY', 'CLAIM');

-- CreateEnum
CREATE TYPE "IsInsured" AS ENUM ('INSURED', 'NOTINSURED', 'PENDING');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('APPROVED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "InjuryType" AS ENUM ('SIMPLE', 'CRITICAL', 'DEATH');

-- CreateEnum
CREATE TYPE "VictimedCondition" AS ENUM ('PASSENGER', 'PEDESTRIAN', 'DRIVER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('PRIVATEUSE', 'BUSINESSUSE');

-- CreateEnum
CREATE TYPE "ClaimProgress" AS ENUM ('OnProgress', 'Completed');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('SUPERADMIN', 'INSURER', 'BRANCHADMIN', 'MEMBER', 'USER', 'TRAFFICPOLICEADMIN', 'TRAFFICPOLICEMEMBER');

-- CreateEnum
CREATE TYPE "OrgDesc" AS ENUM ('MINISTRY', 'INSURANCE', 'TRAFFICPOLICE');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('CURRENT', 'ARCHIEVED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT,
    "email" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "adminRest_password" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "org_code" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch" (
    "id" TEXT NOT NULL,
    "branch_name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "branch_code" TEXT,
    "org_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL,
    "org_name" TEXT NOT NULL,
    "org_code" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "description" "OrgDesc" NOT NULL,

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership" (
    "id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'USER',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "branch_id" TEXT NOT NULL,

    CONSTRAINT "membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate" (
    "id" TEXT NOT NULL,
    "certificate_number" TEXT NOT NULL,
    "status" "InsuranceStatus" NOT NULL DEFAULT 'PendingApproval',
    "policy_number" TEXT NOT NULL,
    "vehicle_plate_number" TEXT,
    "branch_id" TEXT NOT NULL,
    "premium_tarif" DOUBLE PRECISION NOT NULL,
    "issued_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificate_record" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insured" (
    "id" TEXT NOT NULL,
    "reg_number" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "occupation" TEXT,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "sub_city" TEXT NOT NULL,
    "wereda" TEXT NOT NULL,
    "kebelle" TEXT NOT NULL,
    "house_number" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insured_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id" TEXT NOT NULL,
    "plate_number" TEXT NOT NULL,
    "engine_number" TEXT NOT NULL,
    "chassis_number" TEXT NOT NULL,
    "vehicle_model" TEXT NOT NULL,
    "body_type" TEXT NOT NULL,
    "horse_power" TEXT NOT NULL,
    "manufactured_year" INTEGER NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "vehicle_sub_type" TEXT NOT NULL,
    "vehicle_details" TEXT NOT NULL,
    "vehicle_usage" TEXT NOT NULL,
    "vehicle_category" "VehicleCategory" NOT NULL,
    "premium_tarif" DOUBLE PRECISION NOT NULL,
    "passenger_number" INTEGER NOT NULL,
    "carrying_capacity_in_goods" TEXT,
    "purchased_year" INTEGER NOT NULL,
    "duty_free_value" DOUBLE PRECISION NOT NULL,
    "duty_paid_value" DOUBLE PRECISION NOT NULL,
    "vehicle_status" "VEHICLESTATUS" NOT NULL DEFAULT 'NEW',
    "is_insured" "IsInsured" NOT NULL DEFAULT 'NOTINSURED',
    "insured_id" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy" (
    "id" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "policy_start_date" TIMESTAMP(3) NOT NULL,
    "policy_expire_date" TIMESTAMP(3) NOT NULL,
    "policy_issued_conditions" TEXT,
    "persons_entitled_to_use" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "damage_estimate" DOUBLE PRECISION NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimStatus" "ClaimProgress" NOT NULL DEFAULT 'OnProgress',
    "incident_number" TEXT NOT NULL,
    "claimant_id" TEXT NOT NULL,
    "claimant_plate_number" TEXT NOT NULL,
    "certificate_number" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_un_insured" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "damage_estimate" DOUBLE PRECISION NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incident_number" TEXT NOT NULL,
    "vehicle_plate_number" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claim_un_insured_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_hit_and_run" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "damage_estimate" DOUBLE PRECISION NOT NULL,
    "claimer_full_name" TEXT NOT NULL,
    "claimer_region" TEXT NOT NULL,
    "claimer_city" TEXT NOT NULL,
    "claimer_phone_number" TEXT NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branch_id" TEXT NOT NULL,
    "incident_number" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claim_hit_and_run_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insured_police_report" (
    "id" TEXT NOT NULL,
    "incident_number" TEXT NOT NULL,
    "victim_driver_name" TEXT NOT NULL,
    "victim_licence_number" TEXT NOT NULL,
    "victim_level" TEXT NOT NULL,
    "victim_region" TEXT NOT NULL,
    "victim_city" TEXT NOT NULL,
    "victim_sub_city" TEXT NOT NULL,
    "victim_wereda" TEXT NOT NULL,
    "victim_kebelle" TEXT NOT NULL,
    "victim_house_no" TEXT NOT NULL,
    "victim_phone_number" TEXT NOT NULL,
    "victim_vehicle" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "police_branch_id" TEXT NOT NULL,
    "incident_cause" TEXT NOT NULL,
    "incident_date" DATE NOT NULL,
    "incident_place" TEXT NOT NULL,
    "incident_time" TEXT NOT NULL,
    "responsible_vehicle" TEXT NOT NULL,
    "responsible_driver_name" TEXT NOT NULL,
    "responsible_phone_number" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "traffic_police_id" TEXT NOT NULL,

    CONSTRAINT "insured_police_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "un_insured_police_report" (
    "id" TEXT NOT NULL,
    "incident_number" TEXT NOT NULL,
    "victim_driver_name" TEXT NOT NULL,
    "victim_licence_number" TEXT NOT NULL,
    "victim_level" TEXT NOT NULL,
    "victim_region" TEXT NOT NULL,
    "victim_city" TEXT NOT NULL,
    "victim_sub_city" TEXT NOT NULL,
    "victim_wereda" TEXT NOT NULL,
    "victim_kebelle" TEXT NOT NULL,
    "victim_house_no" TEXT NOT NULL,
    "victim_phone_number" TEXT NOT NULL,
    "victim_vehicle_plate_number" TEXT NOT NULL,
    "branch_id" TEXT NOT NULL,
    "police_branch_id" TEXT NOT NULL,
    "incident_cause" TEXT NOT NULL,
    "incident_date" DATE NOT NULL,
    "incident_place" TEXT NOT NULL,
    "incident_time" TEXT NOT NULL,
    "responsible_vehicle_plate_number" TEXT NOT NULL,
    "responsible_driver_name" TEXT NOT NULL,
    "responsible_phone_number" TEXT NOT NULL,
    "report_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "traffic_police_id" TEXT NOT NULL,

    CONSTRAINT "un_insured_police_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hit_and_run_police_report" (
    "id" TEXT NOT NULL,
    "incident_number" TEXT NOT NULL,
    "incident_cause" TEXT NOT NULL,
    "incident_date" TIMESTAMP(3) NOT NULL,
    "incident_place" TEXT NOT NULL,
    "incident_time" TEXT,
    "report_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branch_id" TEXT NOT NULL,
    "police_branch_id" TEXT NOT NULL,
    "traffic_police_id" TEXT NOT NULL,

    CONSTRAINT "hit_and_run_police_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "victim" (
    "id" TEXT NOT NULL,
    "victim_name" TEXT NOT NULL,
    "victim_condition" "VictimedCondition" NOT NULL,
    "injury_type" "InjuryType" NOT NULL,
    "victim_address" TEXT,
    "victim_family_phone_number" TEXT,
    "victim_hospitalized" TEXT,
    "unsured_police_report_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "victim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff" (
    "id" SERIAL NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "vehicle_sub_type" TEXT NOT NULL,
    "vehicle_detail" TEXT NOT NULL,
    "vehicle_usage" TEXT NOT NULL,
    "vehicle_category" "VehicleCategory" NOT NULL DEFAULT 'PRIVATEUSE',
    "premium_tarif" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region_list" (
    "id" SERIAL NOT NULL,
    "region_name" TEXT,
    "region_app" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "region_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_list" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_details" (
    "id" TEXT NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "vehicle_sub_type" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "vehicle_detail" TEXT NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tariff_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "third_party_log" (
    "id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "branch_id" TEXT,
    "time_stamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claim_un_insured_id" TEXT,
    "claim_hit_and_run_id" TEXT,
    "hit_and_run_police_report_id" TEXT,
    "un_insured_police_report_id" TEXT,

    CONSTRAINT "third_party_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accident_record" (
    "id" TEXT NOT NULL,
    "bodily_injury" "ACCIDENTSUBTYPE",
    "property_injury" DOUBLE PRECISION,
    "plate_number" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accident_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "ref_number" TEXT NOT NULL,
    "premium_tarif" DOUBLE PRECISION NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PendingApproval',
    "commission_status" "CommissioningStatus" NOT NULL DEFAULT 'NotCommissioned',
    "insured_id" TEXT NOT NULL,
    "branch_code" TEXT NOT NULL,
    "deleted_status" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BranchToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchToCertificateRecord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrganizationToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MembershipToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateToCertificateRecord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateToPayment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateRecordToPolicy" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateRecordToVehicle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InsuredToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClaimToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InsuredPoliceReportToVictim" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InsuredPoliceReportToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_HitAndRunPoliceReportToVictim" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TariffToThirdPartyLog" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ThirdPartyLogToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ThirdPartyLogToVehicle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_mobile_number_key" ON "user"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_org_code_key" ON "user"("id", "org_code");

-- CreateIndex
CREATE UNIQUE INDEX "branch_branch_name_key" ON "branch"("branch_name");

-- CreateIndex
CREATE UNIQUE INDEX "branch_mobile_number_key" ON "branch"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "branch_branch_code_key" ON "branch"("branch_code");

-- CreateIndex
CREATE UNIQUE INDEX "organization_org_name_key" ON "organization"("org_name");

-- CreateIndex
CREATE UNIQUE INDEX "organization_org_code_key" ON "organization"("org_code");

-- CreateIndex
CREATE UNIQUE INDEX "organization_mobile_number_key" ON "organization"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "membership_user_id_key" ON "membership"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "membership_user_id_branch_id_key" ON "membership"("user_id", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_certificate_number_key" ON "certificate"("certificate_number");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_policy_number_key" ON "certificate"("policy_number");

-- CreateIndex
CREATE UNIQUE INDEX "certificate_vehicle_plate_number_key" ON "certificate"("vehicle_plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "insured_reg_number_key" ON "insured"("reg_number");

-- CreateIndex
CREATE UNIQUE INDEX "insured_mobile_number_branch_id_key" ON "insured"("mobile_number", "branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_plate_number_key" ON "vehicle"("plate_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_engine_number_key" ON "vehicle"("engine_number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_chassis_number_key" ON "vehicle"("chassis_number");

-- CreateIndex
CREATE UNIQUE INDEX "policy_policy_number_key" ON "policy"("policy_number");

-- CreateIndex
CREATE UNIQUE INDEX "claim_claim_number_key" ON "claim"("claim_number");

-- CreateIndex
CREATE UNIQUE INDEX "claim_incident_number_key" ON "claim"("incident_number");

-- CreateIndex
CREATE UNIQUE INDEX "claim_un_insured_claim_number_key" ON "claim_un_insured"("claim_number");

-- CreateIndex
CREATE UNIQUE INDEX "claim_un_insured_incident_number_key" ON "claim_un_insured"("incident_number");

-- CreateIndex
CREATE UNIQUE INDEX "claim_hit_and_run_claim_number_key" ON "claim_hit_and_run"("claim_number");

-- CreateIndex
CREATE UNIQUE INDEX "claim_hit_and_run_incident_number_key" ON "claim_hit_and_run"("incident_number");

-- CreateIndex
CREATE UNIQUE INDEX "insured_police_report_incident_number_key" ON "insured_police_report"("incident_number");

-- CreateIndex
CREATE UNIQUE INDEX "un_insured_police_report_incident_number_key" ON "un_insured_police_report"("incident_number");

-- CreateIndex
CREATE UNIQUE INDEX "hit_and_run_police_report_incident_number_key" ON "hit_and_run_police_report"("incident_number");

-- CreateIndex
CREATE UNIQUE INDEX "payment_ref_number_key" ON "payment"("ref_number");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToThirdPartyLog_AB_unique" ON "_BranchToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToThirdPartyLog_B_index" ON "_BranchToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToCertificateRecord_AB_unique" ON "_BranchToCertificateRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToCertificateRecord_B_index" ON "_BranchToCertificateRecord"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToThirdPartyLog_AB_unique" ON "_OrganizationToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToThirdPartyLog_B_index" ON "_OrganizationToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MembershipToThirdPartyLog_AB_unique" ON "_MembershipToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_MembershipToThirdPartyLog_B_index" ON "_MembershipToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToThirdPartyLog_AB_unique" ON "_CertificateToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToThirdPartyLog_B_index" ON "_CertificateToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToCertificateRecord_AB_unique" ON "_CertificateToCertificateRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToCertificateRecord_B_index" ON "_CertificateToCertificateRecord"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToPayment_AB_unique" ON "_CertificateToPayment"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToPayment_B_index" ON "_CertificateToPayment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateRecordToPolicy_AB_unique" ON "_CertificateRecordToPolicy"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateRecordToPolicy_B_index" ON "_CertificateRecordToPolicy"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateRecordToVehicle_AB_unique" ON "_CertificateRecordToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateRecordToVehicle_B_index" ON "_CertificateRecordToVehicle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InsuredToThirdPartyLog_AB_unique" ON "_InsuredToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_InsuredToThirdPartyLog_B_index" ON "_InsuredToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClaimToThirdPartyLog_AB_unique" ON "_ClaimToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_ClaimToThirdPartyLog_B_index" ON "_ClaimToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InsuredPoliceReportToVictim_AB_unique" ON "_InsuredPoliceReportToVictim"("A", "B");

-- CreateIndex
CREATE INDEX "_InsuredPoliceReportToVictim_B_index" ON "_InsuredPoliceReportToVictim"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InsuredPoliceReportToThirdPartyLog_AB_unique" ON "_InsuredPoliceReportToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_InsuredPoliceReportToThirdPartyLog_B_index" ON "_InsuredPoliceReportToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HitAndRunPoliceReportToVictim_AB_unique" ON "_HitAndRunPoliceReportToVictim"("A", "B");

-- CreateIndex
CREATE INDEX "_HitAndRunPoliceReportToVictim_B_index" ON "_HitAndRunPoliceReportToVictim"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TariffToThirdPartyLog_AB_unique" ON "_TariffToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_TariffToThirdPartyLog_B_index" ON "_TariffToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ThirdPartyLogToUser_AB_unique" ON "_ThirdPartyLogToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ThirdPartyLogToUser_B_index" ON "_ThirdPartyLogToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ThirdPartyLogToVehicle_AB_unique" ON "_ThirdPartyLogToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_ThirdPartyLogToVehicle_B_index" ON "_ThirdPartyLogToVehicle"("B");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_org_code_fkey" FOREIGN KEY ("org_code") REFERENCES "organization"("org_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership" ADD CONSTRAINT "membership_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_policy_number_fkey" FOREIGN KEY ("policy_number") REFERENCES "policy"("policy_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_vehicle_plate_number_fkey" FOREIGN KEY ("vehicle_plate_number") REFERENCES "vehicle"("plate_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insured" ADD CONSTRAINT "insured_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_insured_id_fkey" FOREIGN KEY ("insured_id") REFERENCES "insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_incident_number_fkey" FOREIGN KEY ("incident_number") REFERENCES "insured_police_report"("incident_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_claimant_id_fkey" FOREIGN KEY ("claimant_id") REFERENCES "insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_claimant_plate_number_fkey" FOREIGN KEY ("claimant_plate_number") REFERENCES "vehicle"("plate_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_certificate_number_fkey" FOREIGN KEY ("certificate_number") REFERENCES "certificate"("certificate_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim" ADD CONSTRAINT "claim_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_un_insured" ADD CONSTRAINT "claim_un_insured_incident_number_fkey" FOREIGN KEY ("incident_number") REFERENCES "un_insured_police_report"("incident_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_un_insured" ADD CONSTRAINT "claim_un_insured_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_hit_and_run" ADD CONSTRAINT "claim_hit_and_run_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_hit_and_run" ADD CONSTRAINT "claim_hit_and_run_incident_number_fkey" FOREIGN KEY ("incident_number") REFERENCES "hit_and_run_police_report"("incident_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insured_police_report" ADD CONSTRAINT "insured_police_report_victim_vehicle_fkey" FOREIGN KEY ("victim_vehicle") REFERENCES "vehicle"("plate_number") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insured_police_report" ADD CONSTRAINT "insured_police_report_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insured_police_report" ADD CONSTRAINT "insured_police_report_police_branch_id_fkey" FOREIGN KEY ("police_branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insured_police_report" ADD CONSTRAINT "insured_police_report_responsible_vehicle_fkey" FOREIGN KEY ("responsible_vehicle") REFERENCES "vehicle"("plate_number") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insured_police_report" ADD CONSTRAINT "insured_police_report_traffic_police_id_fkey" FOREIGN KEY ("traffic_police_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "un_insured_police_report" ADD CONSTRAINT "un_insured_police_report_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "un_insured_police_report" ADD CONSTRAINT "un_insured_police_report_police_branch_id_fkey" FOREIGN KEY ("police_branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "un_insured_police_report" ADD CONSTRAINT "un_insured_police_report_traffic_police_id_fkey" FOREIGN KEY ("traffic_police_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hit_and_run_police_report" ADD CONSTRAINT "hit_and_run_police_report_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hit_and_run_police_report" ADD CONSTRAINT "hit_and_run_police_report_police_branch_id_fkey" FOREIGN KEY ("police_branch_id") REFERENCES "branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hit_and_run_police_report" ADD CONSTRAINT "hit_and_run_police_report_traffic_police_id_fkey" FOREIGN KEY ("traffic_police_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "victim" ADD CONSTRAINT "victim_unsured_police_report_id_fkey" FOREIGN KEY ("unsured_police_report_id") REFERENCES "un_insured_police_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "third_party_log" ADD CONSTRAINT "third_party_log_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "third_party_log" ADD CONSTRAINT "third_party_log_claim_un_insured_id_fkey" FOREIGN KEY ("claim_un_insured_id") REFERENCES "claim_un_insured"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "third_party_log" ADD CONSTRAINT "third_party_log_claim_hit_and_run_id_fkey" FOREIGN KEY ("claim_hit_and_run_id") REFERENCES "claim_hit_and_run"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "third_party_log" ADD CONSTRAINT "third_party_log_hit_and_run_police_report_id_fkey" FOREIGN KEY ("hit_and_run_police_report_id") REFERENCES "hit_and_run_police_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "third_party_log" ADD CONSTRAINT "third_party_log_un_insured_police_report_id_fkey" FOREIGN KEY ("un_insured_police_report_id") REFERENCES "un_insured_police_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accident_record" ADD CONSTRAINT "accident_record_plate_number_fkey" FOREIGN KEY ("plate_number") REFERENCES "vehicle"("plate_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accident_record" ADD CONSTRAINT "accident_record_claim_number_fkey" FOREIGN KEY ("claim_number") REFERENCES "claim"("claim_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_insured_id_fkey" FOREIGN KEY ("insured_id") REFERENCES "insured"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_branch_code_fkey" FOREIGN KEY ("branch_code") REFERENCES "branch"("branch_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToThirdPartyLog" ADD CONSTRAINT "_BranchToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToThirdPartyLog" ADD CONSTRAINT "_BranchToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToCertificateRecord" ADD CONSTRAINT "_BranchToCertificateRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToCertificateRecord" ADD CONSTRAINT "_BranchToCertificateRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "certificate_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToThirdPartyLog" ADD CONSTRAINT "_OrganizationToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToThirdPartyLog" ADD CONSTRAINT "_OrganizationToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipToThirdPartyLog" ADD CONSTRAINT "_MembershipToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipToThirdPartyLog" ADD CONSTRAINT "_MembershipToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToThirdPartyLog" ADD CONSTRAINT "_CertificateToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToThirdPartyLog" ADD CONSTRAINT "_CertificateToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToCertificateRecord" ADD CONSTRAINT "_CertificateToCertificateRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToCertificateRecord" ADD CONSTRAINT "_CertificateToCertificateRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "certificate_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToPayment" ADD CONSTRAINT "_CertificateToPayment_A_fkey" FOREIGN KEY ("A") REFERENCES "certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToPayment" ADD CONSTRAINT "_CertificateToPayment_B_fkey" FOREIGN KEY ("B") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToPolicy" ADD CONSTRAINT "_CertificateRecordToPolicy_A_fkey" FOREIGN KEY ("A") REFERENCES "certificate_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToPolicy" ADD CONSTRAINT "_CertificateRecordToPolicy_B_fkey" FOREIGN KEY ("B") REFERENCES "policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToVehicle" ADD CONSTRAINT "_CertificateRecordToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "certificate_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateRecordToVehicle" ADD CONSTRAINT "_CertificateRecordToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredToThirdPartyLog" ADD CONSTRAINT "_InsuredToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "insured"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredToThirdPartyLog" ADD CONSTRAINT "_InsuredToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToThirdPartyLog" ADD CONSTRAINT "_ClaimToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToThirdPartyLog" ADD CONSTRAINT "_ClaimToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToVictim" ADD CONSTRAINT "_InsuredPoliceReportToVictim_A_fkey" FOREIGN KEY ("A") REFERENCES "insured_police_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToVictim" ADD CONSTRAINT "_InsuredPoliceReportToVictim_B_fkey" FOREIGN KEY ("B") REFERENCES "victim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToThirdPartyLog" ADD CONSTRAINT "_InsuredPoliceReportToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "insured_police_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToThirdPartyLog" ADD CONSTRAINT "_InsuredPoliceReportToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HitAndRunPoliceReportToVictim" ADD CONSTRAINT "_HitAndRunPoliceReportToVictim_A_fkey" FOREIGN KEY ("A") REFERENCES "hit_and_run_police_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HitAndRunPoliceReportToVictim" ADD CONSTRAINT "_HitAndRunPoliceReportToVictim_B_fkey" FOREIGN KEY ("B") REFERENCES "victim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TariffToThirdPartyLog" ADD CONSTRAINT "_TariffToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "tariff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TariffToThirdPartyLog" ADD CONSTRAINT "_TariffToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToUser" ADD CONSTRAINT "_ThirdPartyLogToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToUser" ADD CONSTRAINT "_ThirdPartyLogToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToVehicle" ADD CONSTRAINT "_ThirdPartyLogToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "third_party_log"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToVehicle" ADD CONSTRAINT "_ThirdPartyLogToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
