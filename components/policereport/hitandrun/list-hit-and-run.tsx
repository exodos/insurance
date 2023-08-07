import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import { gql, useLazyQuery } from "@apollo/client";
import DetailHitAndRun from "./detail-hit-and-run";
import EditHitAndRun from "./edit-hit-and-run";
import DeleteHitAndRunModal from "./delete-hit-and-run";

const HitAndRunByIncidentNumber = gql`
  query HitAndRunByIncidentNumber($incidentNumber: String!) {
    hitAndRunByIncidentNumber(incidentNumber: $incidentNumber) {
      id
      incidentNumber
      incidentCause
      incidentDate
      incidentPlace
      incidentTime
      reportDate
      policeBranch {
        id
        branchName
        region
      }
      trafficPolices {
        id
        firstName
        lastName
        mobileNumber
      }
      victims {
        id
        victimName
        victimCondition
        injuryType
        victimAddress
        victimFamilyPhoneNumber
        victimHospitalized
        createdAt
        updatedAt
      }
      claimHitAndRuns {
        id
        claimNumber
        damageEstimate
        claimedAt
        claimerFullName
        claimerRegion
        claimerPhoneNumber
      }
    }
  }
`;

const ListHitAndRun = ({ hitAndRunData, href }) => {
  const { data: session, status } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteList, setDeleteList] = useState([]);

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
    hitAndRunByIncidentData,
    {
      loading: hitAndRunByIncidentNumberLoading,
      error: hitAndRunByIncidentNumberError,
      data: HitAndRunByIncidentNumberData,
    },
  ] = useLazyQuery(HitAndRunByIncidentNumber);

  const handleEdit = (List: any) => {
    setShowEditModal((prev) => !prev);
    setEditList(List);
  };

  const handleDelete = (Delete: any) => {
    setShowDeleteModal((prev) => !prev);
    setDeleteList(Delete);
  };

  const handleDetails = () => {
    if (HitAndRunByIncidentNumberData) {
      setShowDetailModal((prev) => !prev);
      setDetailtList(HitAndRunByIncidentNumberData?.hitAndRunByIncidentNumber);
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
                        Incident Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Incident Cause
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Incident Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Incident Place
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Incident Time
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Traffic Police Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Traffic Police Phone Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Police Station Name
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
                        Report Date
                      </th>
                      {(session?.user?.memberships?.role ===
                        "TRAFFICPOLICEADMIN" ||
                        session?.user?.memberships?.role ===
                          "TRAFFICPOLICEMEMBER") && (
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
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Delete</span>
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {hitAndRunData?.hitAndRunPoliceReport?.length > 0 &&
                      hitAndRunData?.hitAndRunPoliceReport?.map(
                        (item: any, i: any) => (
                          <tr key={i}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {i + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.incidentNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.incidentCause}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(
                                new Date(item.incidentDate),
                                "MMM-dd-yyyy"
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.incidentPlace}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.incidentTime}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.trafficPolices.firstName}
                              &nbsp;&nbsp;
                              {item?.trafficPolices.lastName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.trafficPolices.mobileNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.policeBranch.branchName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item?.branchs.branchName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(item.reportDate), "MMM-dd-yyyy")}
                            </td>
                            {(session?.user?.memberships?.role ===
                              "TRAFFICPOLICEADMIN" ||
                              session?.user?.memberships?.role ===
                                "TRAFFICPOLICEMEMBER") && (
                              <>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <>
                                    <button
                                      onClick={() => {
                                        hitAndRunByIncidentData({
                                          variables: {
                                            incidentNumber: item.incidentNumber,
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
                                      data-for="editInsured"
                                    >
                                      <AiFillEdit
                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <ReactTooltip
                                      id="editInsured"
                                      place="top"
                                      effect="solid"
                                    >
                                      Edit Insured
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
                                      data-for="deleteInsured"
                                    >
                                      <AiFillDelete
                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <ReactTooltip
                                      id="deleteInsured"
                                      place="top"
                                      effect="solid"
                                    >
                                      Delete Insured
                                    </ReactTooltip>
                                  </>
                                </td>
                              </>
                            )}
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            {hitAndRunData?.hitAndRunPoliceReport?.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={hitAndRunData.curPage - 1}
                pageCount={hitAndRunData.maxPage}
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
      {showDetailModal ? <DetailHitAndRun hitAndRun={detailList} /> : null}
      {showEditModal ? (
        <EditHitAndRun hitAndRun={editList} href={href} />
      ) : null}
      {showDeleteModal ? (
        <DeleteHitAndRunModal hitAndRun={deleteList} href={href} />
      ) : null}
    </>
  );
};

export default ListHitAndRun;
