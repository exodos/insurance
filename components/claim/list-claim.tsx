import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import { gql, useLazyQuery } from "@apollo/client";
import ClaimDetails from "./claim-details";
import EditInsuredClaim from "./claim-edit";
import { HiCheckBadge } from "react-icons/hi2";
import CreateAccidentRecord from "./update-claim-status";
import UpdateClaimStatus from "./update-claim-status";

const ClaimByClaimNumber = gql`
  query ClaimByClaimNumber($claimNumber: String!) {
    claimByClaimNumber(claimNumber: $claimNumber) {
      id
      claimNumber
      damageEstimate
      claimedAt
      updatedAt
      insuredPoliceReports {
        id
        incidentNumber
        victimDriverName
        victimLicenceNumber
        victimLevel
        victimPhoneNumber
        incidentCause
        incidentDate
        incidentPlace
        incidentTime
        responsibleDriverName
        responsiblePhoneNumber
        reportDate
        policeBranch {
          id
          branchName
        }
      }
      insureds {
        id
        firstName
        region
        city
        mobileNumber
      }
      vehicles {
        id
        plateNumber
        engineNumber
        chassisNumber
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
        premiumTarif
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

const ListClaim = ({ claimData, href }) => {
  const { data: session, status } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);
  const [showAccidentModal, setShowAccidentModal] = useState(false);
  const [accidentList, setAccidentList] = useState([]);

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
      loading: claimByClaimNumberLoading,
      error: claimByClaimNumberError,
      data: claimByClaimNumberData,
    },
  ] = useLazyQuery(ClaimByClaimNumber);

  const handleEdit = (List: any) => {
    setShowEditModal((prev) => !prev);
    setEditList(List);
  };

  const handleDetails = () => {
    if (claimByClaimNumberData) {
      setShowDetailModal((prev) => !prev);
      setDetailtList(claimByClaimNumberData?.claimByClaimNumber);
    }
  };

  const handleAccident = (List: any) => {
    setShowAccidentModal((prev) => !prev);
    setAccidentList(List);
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
                        Incident Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Claimant MobileNumber
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Claimant PlateNumber
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
                        Certificate No
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
                      {(session.user.memberships.role === "SUPERADMIN" ||
                        session.user.memberships.role ===
                          "TRAFFICPOLICEADMIN" ||
                        session.user.memberships.role ===
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
                      {(session.user.memberships.role === "SUPERADMIN" ||
                        session.user.memberships.role ===
                          "INSURER" ||
                        session.user.memberships.role ===
                          "BRANCHADMIN" || session.user.memberships.role ===
                          "MEMBER" ) && (
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Complete</span>
                          </th>                        
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {claimData?.claim?.length > 0 &&
                      claimData?.claim?.map((item: any, i: any) => (
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
                            {item.insuredPoliceReports.incidentNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.insureds.mobileNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.vehicles.plateNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.branchs.branchName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.branchs.region}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.certificates.certificateNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.claimedAt), "dd-MMM-yyyy")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.updatedAt), "dd-MMM-yyyy")}
                          </td>
                          {(session.user.memberships.role === "SUPERADMIN" ||
                            session.user.memberships.role ===
                              "TRAFFICPOLICEADMIN" ||
                            session.user.memberships.role ===
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
                                    data-type="info"
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

                      {(session.user.memberships.role === "SUPERADMIN" ||
                        session.user.memberships.role ===
                          "INSURER" ||
                        session.user.memberships.role ===
                          "BRANCHADMIN" || session.user.memberships.role ===
                          "MEMBER" ) && (
                              <td className="relative whitespace-nowrap py-4 pl-2 pr-3 text-right text-sm font-medium sm:pr-6">
                                <>
                                  <button
                                    onClick={() => handleAccident(item.id)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                    data-tip
                                    data-type="success"
                                    data-for="accidentRecord"
                                  >
                                    <HiCheckBadge
                                      className="flex-shrink-0 h-6 w-6 text-lightGreen"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <ReactTooltip
                                    id="accidentRecord"
                                    place="top"
                                    effect="solid"
                                  >
                                    Complete
                                  </ReactTooltip>
                                </>
                              </td>
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
            {claimData.claim.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={claimData.curPage - 1}
                pageCount={claimData.maxPage}
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
      {showDetailModal ? <ClaimDetails claim={detailList} /> : null}
      {showEditModal ? (
        <EditInsuredClaim claims={editList} href={href} />
      ) : null}
      {showAccidentModal ? (
        <UpdateClaimStatus accidentRecord={accidentList} href={href} />
      ) : null}
    </>
  );
};

export default ListClaim;
