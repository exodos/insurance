import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const PaymentsExport = ({ payments }) => {
  const [paymentsHeaders] = useState([
    { label: "Reference Number", key: "refNumber" },
    { label: "Premium Tarif", key: "premiumTarif" },
    { label: "Payment Status", key: "paymentStatus" },
    { label: "Insured First Name", key: "insureds.firstName" },
    { label: "Insured Registration Number", key: "insureds.regNumber" },
    { label: "Created At", key: "createdAt" },
    { label: "Updated At", key: "updatedAt" },
  ]);

  const data = payments.map((item: any) => ({
    refNumber: item?.refNumber,
    premiumTarif: item?.premiumTarif,
    paymentStatus: item?.paymentStatus,
    insureds: {
      firstName: item?.insureds?.firstName,
      regNumber: item?.insureds?.regNumber,
    },
    createdAt: format(new Date(item.createdAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {payments?.length && (
        <CSVLink
          headers={paymentsHeaders}
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

export default PaymentsExport;
