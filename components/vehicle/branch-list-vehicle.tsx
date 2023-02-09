import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import { gql, useLazyQuery } from "@apollo/client";
import VehicleDetails from "./detail-vehicle";
import DeleteVehicleModal from "./delete-vehicle";
import EditBranchVehicleModal from "./branch-edit-vehicle";
import EditVehicleModal from "./edit-vehicle";

const VehicleByPlateNumber = gql`
  query VehicleByPlateNumber($plateNumber: String!) {
    vehicleByPlateNumber(plateNumber: $plateNumber) {
      id
      plateNumber
      engineNumber
      chassisNumber
      vehicleModel
      bodyType
      horsePower
      vehicleType
      vehicleSubType
      vehicleDetails
      vehicleUsage
      vehicleStatus
      isInsured
      insureds {
        id
        firstName
        lastName
        region
        city
        mobileNumber
      }
      branchs {
        id
        branchName
        region
        city
        mobileNumber
      }
      certificates {
        id
        certificateNumber
        issuedDate
        policies {
          id
          policyNumber
          policyStartDate
          policyExpireDate
          policyIssuedConditions
          personsEntitledToUse
        }
      }
    }
  }
`;

const ListBranchVehicle = ({
  vehicleData,
  regionCode,
  codeList,
  branchId,
  tariffData,
}) => {
  const { data: session, status } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

  const router = useRouter();
  const { asPath } = useRouter();

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
    vehicleByPlateData,
    {
      loading: vehicleByPlateNumberLoading,
      error: vehicleByPlateNumberError,
      data: vehicleByPlateNumberData,
    },
  ] = useLazyQuery(VehicleByPlateNumber);

  const handleEdit = (List: any) => {
    setShowEditModal((prev) => !prev);
    setEditList(List);
  };

  const handleDelete = (Delete: any) => {
    setShowDeleteModal((prev) => !prev);
    setDeleteList(Delete);
  };

  const handleDetails = async (plateNumber: any) => {
    const vehicleData = await vehicleByPlateData({
      variables: {
        plateNumber: plateNumber,
      },
    });

    // console.log(vehicleData.data.vehicleByPlateNumber);

    if (vehicleData.data.vehicleByPlateNumber) {
      setShowDetailModal((prev) => !prev);
      // setDetailtList(vehicleByPlateNumberData?.vehicleByPlateNumber);
      setDetailtList(vehicleData.data.vehicleByPlateNumber);
    }
  };

  return (
    <>
      <div className="px-1 sm:px-2 lg:px-4">
        <div className="mt-5 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-3xl">
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
                        Plate Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Engine Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Chassis Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Model
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Body Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Horse Power
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Manufactured Year
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type Of Vehicle
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Sub Type Of Vehicle
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Details Of Vehicle
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Usage
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Premium Tarif
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Number Of Passengers
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Carrying Capacity (InGoods)
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Year Of Purchased
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Duty Free Value
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Duty Paid Value
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Vehicle Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Is Insured
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Insured First Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Insured Last Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Insured Mobile Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Branch
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
                      {(session.user.memberships.role === "SUPERADMIN" ||
                        session.user.memberships.role === "INSURER" ||
                        session.user.memberships.role === "MEMBER") && (
                        <>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Detail</span>
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Edit</span>
                          </th>
                          <th
                            scope="col"
                            className="relative py-3 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Delete</span>
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {vehicleData?.vehicle.length > 0 &&
                      vehicleData?.vehicle.map((item: any, i: any) => (
                        <tr key={i}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {i + 1}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.plateNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.engineNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.chassisNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.vehicleModel}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.bodyType}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.horsePower}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.manufacturedYear}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.vehicleType}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.vehicleSubType}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.vehicleDetails}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.vehicleUsage}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.premiumTarif}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.passengerNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.carryingCapacityInGoods}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.purchasedYear}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.dutyFreeValue}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.dutyPaidValue}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.vehicleStatus}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.isInsured}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.insureds.firstName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.insureds.lastName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.insureds.mobileNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.branchs.branchName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.createdAt), "MMM-dd-yyyy")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.updatedAt), "MMM-dd-yyyy")}
                          </td>
                          {(session.user.memberships.role === "SUPERADMIN" ||
                            session.user.memberships.role === "INSURER" ||
                            session.user.memberships.role === "MEMBER") && (
                            <>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <>
                                  <button
                                    onClick={() => {
                                      // vehicleByPlateData({
                                      //   variables: {
                                      //     plateNumber: item.plateNumber,
                                      //   },
                                      // });

                                      handleDetails(item.plateNumber);
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
                                    data-for="editVehicle"
                                  >
                                    <AiFillEdit
                                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <ReactTooltip
                                    id="editVehicle"
                                    place="top"
                                    effect="solid"
                                  >
                                    Edit Vehicle
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
                                    data-for="deleteVehicle"
                                  >
                                    <AiFillDelete
                                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <ReactTooltip
                                    id="deleteVehicle"
                                    place="top"
                                    effect="solid"
                                  >
                                    Delete Vehicle
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
            {vehicleData?.vehicle.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={vehicleData.curPage - 1}
                pageCount={vehicleData.maxPage}
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
      {showEditModal ? (
        <EditVehicleModal
          vehicle={editList}
          regionCode={regionCode}
          codeList={codeList}
          href={asPath}
          // branchData={branch}
          tariffData={tariffData}
        />
      ) : null}
      {showDetailModal ? <VehicleDetails vehicle={detailList} /> : null}

      {showDeleteModal ? (
        <DeleteVehicleModal vehicle={deleteList} href={asPath} />
      ) : null}
    </>
  );
};

export default ListBranchVehicle;
