import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const VehicleExport = ({ vehicles }) => {
  const [vehiclesHeaders] = useState([
    { label: "Plate Number", key: "plateNumber" },
    { label: "Engine Number", key: "engineNumber" },
    { label: "Chassis Number", key: "chassisNumber" },
    { label: "Vehicle Model", key: "vehicleModel" },
    { label: "Body Type", key: "bodyType" },
    { label: "Horse Power", key: "horsePower" },
    { label: "Manufactured Year", key: "manufacturedYear" },
    { label: "Type Of Vehicle", key: "vehicleType" },
    { label: "Sub Type Of Vehicle", key: "vehicleSubType" },
    { label: "Details Of Vehicle", key: "vehicleDetails" },
    { label: "Usage", key: "vehicleUsage" },
    { label: "Category", key: "vehicleCategory" },
    { label: "Number Of Passenger", key: "passengerNumber" },
    { label: "Premium Tarif", key: "premiumTarif" },
    { label: "Carrying Capacity", key: "carryingCapacityInGoods" },
    { label: "Purchased Year", key: "purchasedYear" },
    { label: "Duty Free Value", key: "dutyFreeValue" },
    { label: "Duty Paid Value", key: "dutyPaidValue" },
    { label: "Vehicle Status", key: "vehicleStatus" },
    { label: "Insurance Status", key: "isInsured" },
    { label: "Insured First Name", key: "insureds.firstName" },
    { label: "Insured Last Name", key: "insureds.lastName" },
    { label: "Insured Phone Number", key: "insureds.mobileNumber" },
    { label: "Branch Name", key: "branchs.branchName" },
    { label: "Insurer Name", key: "branchs.organizations.orgName" },
    { label: "Certificate Number", key: "certificates.certificateNumber" },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" },
  ]);

  const data = vehicles.map((item: any) => ({
    plateNumber: item?.plateNumber,
    engineNumber: item?.engineNumber,
    chassisNumber: item?.chassisNumber,
    vehicleModel: item?.vehicleModel,
    bodyType: item?.bodyType,
    horsePower: item?.horsePower,
    manufacturedYear: item?.manufacturedYear,
    vehicleType: item?.vehicleType,
    vehicleSubType: item?.vehicleSubType,
    vehicleDetails: item?.vehicleDetails,
    vehicleUsage: item?.vehicleUsage,
    vehicleCategory: item?.vehicleCategory,
    passengerNumber: item?.passengerNumber,
    premiumTarif: item?.premiumTarif,
    carryingCapacityInGoods: item?.carryingCapacityInGoods,
    purchasedYear: item?.purchasedYear,
    dutyFreeValue: item?.dutyFreeValue,
    dutyPaidValue: item?.dutyPaidValue,
    vehicleStatus: item?.vehicleStatus,
    isInsured: item?.isInsured,
    insureds: {
      firstName: item?.insureds?.firstName,
      lastName: item?.insureds?.lastName,
      mobileNumber: item?.insureds?.mobileNumber,
    },
    branchs: {
      branchName: item?.branchs.branchName,
      organizations: {
        orgName: item?.branchs?.organizations?.orgName,
      },
    },
    certificates: {
      certificateNumber: item?.certificates?.certificateNumber,
    },
    createdAt: format(new Date(item.createdAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {vehicles?.length && (
        <CSVLink
          headers={vehiclesHeaders}
          data={data}
          filename="result.csv"
          target="_blank"
          className="mt-2 inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-lightBlue px-16 py-3 text-base font-medium text-white shadow-sm hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
        >
          <BiUpArrowCircle
            className="flex-shrink-0 mr-1.5 h-6 w-6 text-white"
            aria-hidden="true"
          />
          Export
        </CSVLink>
      )}
    </div>
  );
};

export default VehicleExport;
