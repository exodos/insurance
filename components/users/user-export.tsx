import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const UserExport = ({ users }) => {
  const [usersHeaders] = useState([
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Region", key: "region" },
    { label: "City", key: "city" },
    { label: "Email", key: "email" },
    { label: "Mobile Number", key: "mobileNumber" },
    { label: "Role", key: "memberships.role" },
    { label: "Branch Name", key: "memberships.branchs.branchName" },
    { label: "Created Date", key: "createdAt" },
    { label: "Updated Date", key: "updatedAt" },
  ]);

  const data = users.map((item: any) => ({
    firstName: item?.firstName,
    lastName: item?.lastName,
    region: item?.region,
    city: item?.city,
    email: item?.email,
    mobileNumber: item?.mobileNumber,
    memberships: {
      role: item?.memberships?.role,
      branchs: {
        branchName: item?.memberships?.branchs?.branchName,
      },
    },
    createdAt: format(new Date(item.createdAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {users?.length && (
        <CSVLink
          headers={usersHeaders}
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

export default UserExport;
