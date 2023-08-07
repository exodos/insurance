import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import { gql, useLazyQuery } from "@apollo/client";
import AdminInsuredDetail from "./detail-insured";
import AdminInsuredEdit from "./edit-insured";
import DeleteInsuredModal from "./delete-insured";

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

const ListInsured = ({ insuredData }) => {
  const { data: session, status } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  console.log(insuredData);

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

  const [
    insuredByMobileData,
    {
      loading: insuredByMobileNumberLoading,
      error: insuredByMobileNumberError,
      data: insuredByMobileNumberData,
    },
  ] = useLazyQuery(InsuredByMobileNumber);

  const handleEdit = (List: any) => {
    setShowEditModal((prev) => !prev);
    setEditList(List);
  };

  const handleDelete = (Delete: any) => {
    setShowDeleteModal((prev) => !prev);
    setDeleteList(Delete);
  };

  const handleDetails = () => {
    if (insuredByMobileNumberData) {
      setShowDetailModal((prev) => !prev);
      setDetailtList(insuredByMobileNumberData?.insuredByMobileNumber);
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
                        Registration #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Last Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Occupation
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Region
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        City
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        SubCity
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Wereda
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Kebele
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        House Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Mobile Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Created At
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Updated At
                      </th>
                      {(session?.user?.memberships?.role === "SUPERADMIN" ||
                        session?.user?.memberships?.role === "INSURER" ||
                        session?.user?.memberships?.role === "MEMBER") && (
                        <>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Details</span>
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Delete</span>
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {insuredData?.insured?.length > 0 &&
                      insuredData?.insured?.map((item: any, i: any) => (
                        <tr key={i}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {item.regNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.firstName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.lastName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.occupation}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.region}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.city}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.subCity}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.wereda}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.kebelle}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.houseNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.mobileNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.createdAt), "MMM-dd-yyyy")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.updatedAt), "MMM-dd-yyyy")}
                          </td>
                          {(session?.user?.memberships?.role === "SUPERADMIN" ||
                            session?.user?.memberships?.role === "INSURER" ||
                            session?.user?.memberships?.role === "MEMBER") && (
                            <>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <>
                                  <button
                                    onClick={() => {
                                      insuredByMobileData({
                                        variables: {
                                          mobileNumber: item.mobileNumber,
                                        },
                                      });

                                      handleDetails();
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    data-tip
                                    data-type="success"
                                    data-for="showDetails"
                                  >
                                    <BiShow
                                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <ReactTooltip
                                    id="showDetails"
                                    place="top"
                                    effect="solid"
                                  >
                                    Show Details
                                  </ReactTooltip>
                                </>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <>
                                  <button
                                    onClick={() => handleEdit(item)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    data-tip
                                    data-type="warning"
                                    data-for="editUser"
                                  >
                                    <AiFillEdit
                                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <ReactTooltip
                                    id="editUser"
                                    place="top"
                                    effect="solid"
                                  >
                                    Edit User
                                  </ReactTooltip>
                                </>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <>
                                  <button
                                    onClick={() => handleDelete(item)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    data-tip
                                    data-type="error"
                                    data-for="deleteUser"
                                  >
                                    <AiFillDelete
                                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <ReactTooltip
                                    id="deleteUser"
                                    place="top"
                                    effect="solid"
                                  >
                                    Delete User
                                  </ReactTooltip>
                                </>
                              </td>
                            </>
                          )}
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
            {insuredData?.insured.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={insuredData.curPage - 1}
                pageCount={insuredData.maxPage}
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
      {showDetailModal ? <AdminInsuredDetail insured={detailList} /> : null}
      {showEditModal ? (
        <AdminInsuredEdit insured={editList} href={asPath} />
      ) : null}
      {showDeleteModal ? <DeleteInsuredModal insured={deleteList} /> : null}
    </>
  );
};

export default ListInsured;
