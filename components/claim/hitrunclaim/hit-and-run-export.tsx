import { CloudArrowUpIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const HitAndRunExport = ({ hitAndRuns }) => {
  const [hitAndRunsHeaders] = useState([
    { label: "Claim Number", key: "claimNumber" },
    { label: "Estimated Damage", key: "damageEstimate" },
    { label: "Claimer Full Name", key: "claimerFullName" },
    { label: "Claimer Region", key: "claimerRegion" },
    { label: "Claimer City", key: "claimerCity" },
    { label: "Claimer PhoneNumber", key: "claimerPhoneNumber" },
    { label: "Incident Number", key: "hitAndRunPoliceReports.incidentNumber" },
    { label: "Branch Name", key: "branchs.branchName" },
    { label: "Claimed At", key: "claimedAt" },
    { label: "Updated Date", key: "updatedAt" },
  ]);

  const data = hitAndRuns.map((item: any) => ({
    claimNumber: item?.claimNumber,
    damageEstimate: item?.damageEstimate,
    claimerFullName: item?.claimerFullName,
    claimerRegion: item?.claimerRegion,
    claimerCity: item?.claimerCity,
    claimerPhoneNumber: item?.claimerPhoneNumber,
    hitAndRunPoliceReports: {
      incidentNumber: item?.hitAndRunPoliceReports?.incidentNumber,
    },
    branchs: {
      branchName: item?.branchs?.branchName,
    },
    claimedAt: format(new Date(item.claimedAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {hitAndRuns?.length && (
        <CSVLink
          headers={hitAndRunsHeaders}
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

export default HitAndRunExport;
