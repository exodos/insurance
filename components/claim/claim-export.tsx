import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const ClaimExport = ({ claims }) => {
  const [claimsHeaders] = useState([
    { label: "Claim Number", key: "claimNumber" },
    { label: "Estimated Damage", key: "damageEstimate" },
    { label: "Incident Number", key: "insuredPoliceReports.incidentNumber" },
    { label: "Reg Number", key: "insureds.regNumber" },
    { label: "First Name", key: "insureds.firstName" },
    { label: "Last Name", key: "insureds.lastName" },
    { label: "Mobile Number", key: "insureds.mobileNumber" },
    { label: "Plate Number", key: "vehicles.plateNumber" },
    { label: "Branch Name", key: "branchs.branchName" },
    { label: "Certificate Number", key: "certificates.certificateNumber" },
    { label: "Claimed At", key: "claimedAt" },
    { label: "Updated Date", key: "updatedAt" },
  ]);

  const data = claims.map((item: any) => ({
    claimNumber: item?.claimNumber,
    damageEstimate: item?.damageEstimate,
    insuredPoliceReports: {
      incidentNumber: item?.insuredPoliceReports?.incidentNumber,
    },
    insureds: {
      regNumber: item?.insureds?.regNumber,
      firstName: item?.insureds?.firstName,
      lastName: item?.insureds?.lastName,
      mobileNumber: item?.insureds?.mobileNumber,
    },
    vehicles: {
      plateNumber: item?.vehicles?.plateNumber,
    },
    branchs: {
      branchName: item?.branchs?.branchName,
    },
    certificates: {
      certificateNumber: item?.certificates?.certificateNumber,
    },
    claimedAt: format(new Date(item.claimedAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {claims?.length && (
        <CSVLink
          headers={claimsHeaders}
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

export default ClaimExport;
