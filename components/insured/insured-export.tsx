import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const InsuredExport = ({ insureds }) => {
  const [insuredsHeaders] = useState([
    { label: "Registration Number", key: "regNumber" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Occupation", key: "occupation" },
    { label: "Region", key: "region" },
    { label: "City", key: "city" },
    { label: "SubCity", key: "subCity" },
    { label: "Wereda", key: "wereda" },
    { label: "kebelle", key: "kebelle" },
    { label: "House Number", key: "houseNumber" },
    { label: "Phone Number", key: "mobileNumber" },
    { label: "Branch Name", key: "branchs.branchName" },
    { label: "Insurer Name", key: "branchs.organizations.orgName" },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" },
  ]);

  const data = insureds.map((item: any) => ({
    regNumber: item?.regNumber,
    firstName: item?.firstName,
    lastName: item?.lastName,
    occupation: item?.occupation,
    region: item?.region,
    city: item?.city,
    subCity: item?.subCity,
    wereda: item?.wereda,
    kebelle: item?.kebelle,
    houseNumber: item?.houseNumber,
    mobileNumber: item?.mobileNumber,
    branchs: {
      branchName: item?.branchs.branchName,
      organizations: {
        orgName: item?.branchs?.organizations?.orgName,
      },
    },
    createdAt: format(new Date(item.createdAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {insureds?.length && (
        <CSVLink
          headers={insuredsHeaders}
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

export default InsuredExport;
