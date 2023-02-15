import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const CertificateExport = ({ certificates }) => {
  const [certificatesHeaders] = useState([
    { label: "Certificate Number", key: "certificateNumber" },
    { label: "Policy Number", key: "policies.policyNumber" },
    { label: "Policy Start Date", key: "policies.policyStartDate" },
    { label: "Policy Expire Date", key: "policies.policyExpireDate" },
    {
      label: "Policy Issued Conditions",
      key: "policies.policyIssuedConditions",
    },
    {
      label: "Persons Entitled To Use/Drive",
      key: "policies.personsEntitledToUse",
    },
    { label: "Plate Number", key: "vehicles.plateNumber" },
    { label: "Premium Tarif", key: "premiumTarif" },
    { label: "Branch Name", key: "branchs.branchName" },
    { label: "Insurer Name", key: "branchs.organizations.orgName" },
    { label: "Issued Date", key: "issuedDate" },
    { label: "Updated Date", key: "updatedAt" },
  ]);

  const data = certificates.map((item: any) => ({
    certificateNumber: item?.certificateNumber,
    policies: {
      policyNumber: item?.policies.policyNumber,
      policyStartDate: format(
        new Date(item.policies.policyStartDate),
        "yyyy-MM-dd"
      ),
      policyExpireDate: format(
        new Date(item.policies.policyExpireDate),
        "yyyy-MM-dd"
      ),
      policyIssuedConditions: item?.policies.policyIssuedConditions,
      personsEntitledToUse: item?.policies.personsEntitledToUse,
    },
    vehicles: {
      plateNumber: item?.vehicles?.plateNumber,
    },
    premiumTarif: item?.premiumTarif,
    branchs: {
      branchName: item?.branchs.branchName,
      organizations: {
        orgName: item?.branchs?.organizations?.orgName,
      },
    },
    issuedDate: format(new Date(item.issuedDate), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {certificates?.length && (
        <CSVLink
          headers={certificatesHeaders}
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

export default CertificateExport;
