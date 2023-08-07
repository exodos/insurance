import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { gql } from "apollo-server-micro";
import { AiFillEdit } from "react-icons/ai";
import ReactTooltip from "react-tooltip";
import { useLazyQuery } from "@apollo/client";
import { BiShow } from "react-icons/bi";
import HitAndRunClaimDetails from "./detail-hit-and-run-claim";
import EditHitAndRunClaim from "./edit-hit-and-run";

const ClaimHitAndRunByClaimNumber = gql`
  query ClaimHitAndRunByClaimNumber($claimNumber: String!) {
    claimHitAndRunByClaimNumber(claimNumber: $claimNumber) {
      id
      claimNumber
      damageEstimate
      claimedAt
      claimerFullName
      claimerRegion
      claimerCity
      claimerPhoneNumber
      updatedAt
      branchs {
        id
        branchName
        region
        city
        mobileNumber
      }
    }
  }
`;

const ListHitAndRunClaim = ({ hitAndRunClaimData, href }) => {
  const { data: session, status } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);

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
    claimNumberData,
    {
      loading: ClaimHitAndRunByClaimNumberLoading,
      error: ClaimHitAndRunByClaimNumberError,
      data: ClaimHitAndRunByClaimNumberData,
    },
  ] = useLazyQuery(ClaimHitAndRunByClaimNumber);

  const handleEdit = (List: any) => {
    setShowEditModal((prev) => !prev);
    setEditList(List);
  };
  // const handleDelete = (Delete: any) => {};

  const handleDetails = () => {
    if (ClaimHitAndRunByClaimNumberData) {
      setShowDetailModal((prev) => !prev);
      setDetailtList(
        ClaimHitAndRunByClaimNumberData?.claimHitAndRunByClaimNumber
      );
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
                        Claim Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Estimate Damage
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Claimant Full Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Claimant Region
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Claimant City
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Claimant Phone Number
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
                        Defendant
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Defendant Region
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Claimed At
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Update At
                      </th>
                      {(session.user?.memberships?.role ===
                        "TRAFFICPOLICEADMIN" ||
                        session.user?.memberships?.role ===
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
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {hitAndRunClaimData?.claimHitAndRuns?.length > 0 &&
                      hitAndRunClaimData?.claimHitAndRuns?.map(
                        (item: any, i: any) => (
                          <tr key={i}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {i + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.claimNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.damageEstimate}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.claimerFullName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.claimerRegion}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.claimerCity}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.claimerPhoneNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.hitAndRunPoliceReports.incidentNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.branchs.branchName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.branchs.region}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(item.claimedAt), "dd-MMM-yyyy")}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(item.updatedAt), "dd-MMM-yyyy")}
                            </td>
                            {(session.user?.memberships?.role ===
                              "TRAFFICPOLICEADMIN" ||
                              session.user?.memberships?.role ===
                                "TRAFFICPOLICEMEMBER") && (
                              <>
                                <td className="relative whitespace-nowrap py-4 pl-2 pr-3 text-right text-sm font-medium sm:pr-6">
                                  <>
                                    <button
                                      onClick={() => {
                                        claimNumberData({
                                          variables: {
                                            claimNumber: item.claimNumber,
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
                                <td className="relative whitespace-nowrap py-4 pl-2 pr-3 text-right text-sm font-medium sm:pr-6">
                                  <>
                                    <button
                                      onClick={() => handleEdit(item)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                      data-tip
                                      data-type="warning"
                                      data-for="editClaim"
                                    >
                                      <AiFillEdit
                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <ReactTooltip
                                      id="editClaim"
                                      place="top"
                                      effect="solid"
                                    >
                                      Edit Claim
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

        <div className="mt-5 flex align-middle py-1 md:px-6 lg:px-8 flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            {hitAndRunClaimData.claimHitAndRuns.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={hitAndRunClaimData.curPage - 1}
                pageCount={hitAndRunClaimData.maxPage}
                onPageChange={handlePaginate}
                containerClassName={
                  "border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mt-6"
                }
                pageClassName={
                  "border-transparent text-gray-700 hover:text-gray-900 hover:border-black border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
                }
                previousLinkClassName={
                  "relative inline-flex mt-2 items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                }
                nextLinkClassName={
                  "relative inline-flex mt-2 items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
        <EditHitAndRunClaim hitAndRunClaims={editList} href={href} />
      ) : null}
      {showDetailModal ? (
        <HitAndRunClaimDetails hitAndRunclaim={detailList} />
      ) : null}
    </>
  );
};

export default ListHitAndRunClaim;
