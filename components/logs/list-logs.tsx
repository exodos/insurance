import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import { gql, useLazyQuery } from "@apollo/client";
import jsonDiff from "json-diff";

const InsuredByMobileNumber = gql`
  query InsuredByMobileNumber($mobileNumber: String!) {
    insuredByMobileNumber(mobileNumber: $mobileNumber) {
      id
      firstName
      lastName
      region
      city
      subCity
      wereda
      kebelle
      houseNumber
      mobileNumber
      createdAt
      updatedAt
      vehicles {
        id
        plateNumber
        engineNumber
        chassisNumber
        vehicleModel
        bodyType
        horsePower
        manufacturedYear
        vehicleType
        vehicleSubType
        vehicleDetails
        vehicleUsage
        passengerNumber
        carryingCapacityInGoods
        purchasedYear
        dutyFreeValue
        dutyPaidValue
        vehicleStatus
        isInsured
        createdAt
        updatedAt
      }
    }
  }
`;

const ListLogs = ({ logiData }) => {
  const { data: session, status } = useSession();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);

  const { asPath } = useRouter();

  const router = useRouter();
  const handlePaginate = (page: any) => {
    const path = router.pathname;
    const query = router.query;
    query.page = page.selected + 1;
    router.push({
      pathname: path,
      query: query,
    });
  };

  const tableHeader = (oldValue, newValue) => {
    const diff = jsonDiff.diff(oldValue, newValue);
    // console.log(diff);
    if (diff === undefined) {
      return null;
    } else {
      const header = Object.keys(diff);
      return header?.map((key, index) => {
        return (
          <th
            key={index}
            scope="col"
            className="px-4 py-3.5 text-center text-sm font-semibold text-gray-900"
          >
            {key}
          </th>
        );
      });
    }
  };

  const tableBody = (oldValue: any, newValue: any) => {
    const diff = jsonDiff.diff(oldValue, newValue);
    if (diff !== undefined) {
      const data = Object.values(diff);
      return data?.map((val: any, i) => {
        return (
          <>
            <td
              key={i}
              className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500 border border-slate-200"
            >
              {val?.__old}
            </td>
            <td
              key={i}
              className="whitespace-nowrap text-center px-3 py-4 text-sm text-gray-500 border border-slate-200"
            >
              {val?.__new}
            </td>
          </>
        );
      });
    } else {
      return null;
    }
  };

  return (
    <>
      <div className="px-1 sm:px-2 lg:px-4">
        <div className="mt-5 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-xl">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        User Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Branch Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Mode
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        Changed Data
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Logged Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {logiData?.thirdPartyLogs?.length > 0 &&
                      logiData?.thirdPartyLogs?.map((item: any, i: any) => (
                        <tr key={i}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {i + 1}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.userEmail}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item?.branchCon?.branchName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.action}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.mode}
                          </td>
                          {item.action !== "Create" &&
                            item.action !== "Delete" && (
                              <td className="whitespace-nowrap border border-slate-300">
                                <table className="min-w-full">
                                  <thead>
                                    <tr>
                                      {tableHeader(
                                        item?.oldValue,
                                        item?.newValue
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      {tableBody(
                                        item?.oldValue,
                                        item?.newValue
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            )}
                          {item.action === "Create" && (
                            <td className="whitespace-nowrap text-center px-5 py-4 text-sm text-gray-500">
                              No Change (Create)
                            </td>
                          )}
                          {item.action === "Delete" && (
                            <td className="whitespace-nowrap text-center px-5 py-4 text-sm text-gray-500">
                              No Change (Delete)
                            </td>
                          )}
                          {/* <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6"> */}
                          <td className="whitespace-nowrap text-center px-5 py-4 text-sm text-gray-500">
                            {format(new Date(item.timeStamp), "yyyy-MM-dd")}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex align-middle py-1 md:px-6 lg:px-8 flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            {logiData?.thirdPartyLogs.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={logiData.curPage - 1}
                pageCount={logiData.maxPage}
                onPageChange={handlePaginate}
                containerClassName={
                  "border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mt-6"
                }
                pageClassName={
                  "border-transparent text-gray-700 hover:text-gray-900 hover:border-black border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                }
                previousLinkClassName={
                  "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                }
                nextLinkClassName={
                  "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                }
                activeClassName={
                  "border-t-2 border-lightBlue text-deepGreen font-semibold"
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListLogs;
