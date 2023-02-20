import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const OrganizationExport = ({ orgs }) => {
  const [orgsHeaders] = useState([
    { label: "Insurer Name", key: "orgName" },
    { label: "Region", key: "region" },
    { label: "City", key: "city" },
    { label: "Phone Number", key: "mobileNumber" },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" },
  ]);

  const data = orgs.map((item: any) => ({
    orgName: item?.orgName,
    region: item?.region,
    city: item?.city,
    mobileNumber: item?.mobileNumber,
    createdAt: format(new Date(item.createdAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {orgs?.length && (
        <CSVLink
          headers={orgsHeaders}
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

export default OrganizationExport;
