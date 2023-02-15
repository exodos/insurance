import { format } from "date-fns";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { BiUpArrowCircle } from "react-icons/bi";

const TariffExport = ({ tariffs }) => {
  const [tariffsHeaders] = useState([
    { label: "Type Of Vehicle", key: "vehicleType" },
    { label: "Sub Type Of Vehicle", key: "vehicleSubType" },
    { label: "Detail Vehicle", key: "vehicleDetail" },
    { label: "Usage", key: "vehicleUsage" },
    { label: "Category", key: "vehicleCategory" },
    { label: "Type Of Vehicle", key: "vehicleType" },
    { label: "Premium Tarif", key: "premiumTarif" },
    { label: "Created Date", key: "createdAt" },
    { label: "Updated Date", key: "updatedAt" },
  ]);

  const data = tariffs.map((item: any) => ({
    vehicleType: item?.vehicleType,
    vehicleSubType: item?.vehicleSubType,
    vehicleDetail: item?.vehicleDetail,
    vehicleUsage: item?.vehicleUsage,
    vehicleCategory: item?.vehicleCategory,
    premiumTarif: item?.premiumTarif,
    createdAt: format(new Date(item.createdAt), "yyyy-MM-dd"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd"),
  }));

  return (
    <div className="mb-4">
      {tariffs?.length && (
        <CSVLink
          headers={tariffsHeaders}
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

export default TariffExport;
