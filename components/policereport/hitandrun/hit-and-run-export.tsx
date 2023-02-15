import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const HitAndRunPoliceReportExport = ({ policeReports }) => {
  const [policeReportsHeaders] = useState([
    { label: "Incident Number", key: "incidentNumber" },
    { label: "Incident Cause", key: "incidentCause" },
    { label: "Incident Place", key: "incidentPlace" },
    { label: "Incident Time", key: "incidentTime" },
    { label: "Branch Name", key: "branchs.branchName" },
    { label: "Police Station Name", key: "policeBranch.branchName" },
    { label: "Traffic Police Name", key: "trafficPolices.firstName" },
    {
      label: "Traffic Police Mobile Number",
      key: "trafficPolices.mobileNumber",
    },
    { label: "Claim Number", key: "claimHitAndRuns.claimNumber" },
    { label: "Incident Date", key: "incidentDate" },
    { label: "Report Date", key: "reportDate" },
  ]);

  const data = policeReports.map((item: any) => ({
    incidentNumber: item?.incidentNumber,
    incidentCause: item?.incidentCause,
    incidentPlace: item?.incidentPlace,
    incidentTime: item?.incidentTime,
    branchs: {
      branchName: item?.branchs?.branchName,
    },
    policeBranch: {
      branchName: item?.policeBranch?.branchName,
    },
    trafficPolices: {
      firstName: item?.trafficPolices?.firstName,
      mobileNumber: item?.trafficPolices?.mobileNumber,
    },
    claimHitAndRuns: {
      claimNumber: item?.claimHitAndRuns?.claimNumber,
    },
    incidentDate: format(new Date(item.incidentDate), "yyyy-MM-dd"),
    reportDate: format(new Date(item.reportDate), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {policeReports?.length && (
        <CSVLink
          headers={policeReportsHeaders}
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

export default HitAndRunPoliceReportExport;
