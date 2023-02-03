import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BiShow } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ReactTooltip from "react-tooltip";
import { gql, useLazyQuery } from "@apollo/client";
import AdminInsuredPoliceReportDetail from "./insured-detail-report";
import AdminInsuredPoliceReportEdit from "./insured-edit-report";
import AdminInsuredPoliceReportDelete from "./insured-delete-report";
import InsuredPoliceReportEditModal from "./insured-edit-report";
import DetailInsuredPoliceReportModal from "./insured-detail-report";
import DeleteInsuredPoliceReportModal from "./insured-delete-report";
// import DetailPoliceReport from "./detail-police-report";
// import EditPoliceReport from "./edit-police-report";
// import PoliceReportDelete from "./delete-police-report";

const InsuredPoliceReportByIncidentNumber = gql`
  query InsuredPoliceReportByIncidentNumber($incidentNumber: String!) {
    insuredPoliceReportByIncidentNumber(incidentNumber: $incidentNumber) {
      id
      incidentNumber
      victimDriverName
      victimLicenceNumber
      victimLevel
      victimRegion
      victimCity
      victimSubCity
      victimWereda
      victimKebelle
      victimHouseNo
      victimPhoneNumber
      incidentCause
      incidentDate
      incidentPlace
      incidentTime
      responsibleDriverName
      responsiblePhoneNumber
      reportDate
      vehicle_PoliceReport_victimVehicle {
        id
        plateNumber
        vehicleType
        insureds {
          insuredName
          mobileNumber
        }
      }
      branchs {
        id
        branchName
        mobileNumber
        region
        city
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
      vehicle_PoliceReport_responsibleVehicle {
        id
        plateNumber
        vehicleType
        insureds {
          id
          insuredName
          mobileNumber
          region
          city
        }
      }
      trafficPolices {
        id
        firstName
        lastName
        region
        city
        mobileNumber
      }
      policeBranch {
        branchName
      }
    }
  }
`;

const ListInsuredPoliceReport = ({ policeReportData }) => {
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
    incidentNumberData,
    {
      loading: insuredPoliceReportByIncidentNumberLoading,
      error: insuredPoliceReportByIncidentNumberError,
      data: insuredPoliceReportByIncidentNumberData,
    },
  ] = useLazyQuery(InsuredPoliceReportByIncidentNumber);

  const handleEdit = (List: any) => {
    setShowEditModal((prev) => !prev);
    setEditList(List);
  };

  const handleDelete = (Delete: any) => {
    setShowDeleteModal((prev) => !prev);
    setDeleteList(Delete);
  };
  const handleDetails = () => {
    if (insuredPoliceReportByIncidentNumberData) {
      setShowDetailModal((prev) => !prev);
      setDetailtList(
        insuredPoliceReportByIncidentNumberData?.insuredPoliceReportByIncidentNumber
      );
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
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Incident Number
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Victim Driver Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Victim Licence Number
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Victim Level
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Victim PhoneNumber
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
                        Responsible Driver Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Responsible PhoneNumber
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Traffic Police First Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Traffic Police Last Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Traffic Police PhoneNumber
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
                        Report Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Victim PlateNumber
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Victim Insured Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Victim Insured mobileNumber
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
                        Responsible PlateNumber
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Responsible Insured Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Responsible Insured mobileNumber
                      </th>
                      <th
                        scope="col"
                        className="relative py-3 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Detail</span>
                      </th>
                      {(session.user.memberships.role ===
                        "TRAFFICPOLICEADMIN" ||
                        session.user.memberships.role ===
                          "TRAFFICPOLICEMEMBER") && (
                        <>
                          <th
                            scope="col"
                            className="relative py-3 pl-3 pr-4 sm:pr-6"
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
                    {policeReportData?.insuredPoliceReports?.length > 0 &&
                      policeReportData?.insuredPoliceReports?.map(
                        (item: any, i: any) => (
                          <tr key={i}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {i + 1}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.incidentNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.victimDriverName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.victimLicenceNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.victimLevel}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.victimPhoneNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.incidentCause}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(
                                new Date(item.incidentDate),
                                "MMM-dd-yyyy"
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.incidentPlace}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.incidentTime}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.responsibleDriverName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.responsiblePhoneNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.trafficPolices.firstName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.trafficPolices.lastName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.trafficPolices.mobileNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.policeBranch.branchName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {format(new Date(item.reportDate), "MMM-dd-yyyy")}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                item.vehicle_PoliceReport_victimVehicle
                                  .plateNumber
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                item.vehicle_PoliceReport_victimVehicle.insureds
                                  .insuredName
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                item.vehicle_PoliceReport_victimVehicle.insureds
                                  .mobileNumber
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {item.branchs.branchName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                item.vehicle_PoliceReport_responsibleVehicle
                                  .plateNumber
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                item.vehicle_PoliceReport_responsibleVehicle
                                  .insureds.insuredName
                              }
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {
                                item.vehicle_PoliceReport_responsibleVehicle
                                  .insureds.mobileNumber
                              }
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-2 pr-3 text-right text-sm font-medium sm:pr-6">
                              <>
                                <button
                                  onClick={() => {
                                    incidentNumberData({
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
                            {(session.user.memberships.role ===
                              "TRAFFICPOLICEADMIN" ||
                              session.user.memberships.role ===
                                "TRAFFICPOLICEMEMBER") && (
                              <>
                                <td className="relative whitespace-nowrap py-4 pl-2 pr-3 text-right text-sm font-medium sm:pr-6">
                                  <>
                                    <button
                                      onClick={() => handleEdit(item)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                      data-tip
                                      data-type="warning"
                                      data-for="editPoliceReport"
                                    >
                                      <AiFillEdit
                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <ReactTooltip
                                      id="editPoliceReport"
                                      place="top"
                                      effect="solid"
                                    >
                                      Edit Police Report
                                    </ReactTooltip>
                                  </>
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-2 pr-3 text-right text-sm font-medium sm:pr-6">
                                  <>
                                    <button
                                      onClick={() => handleDelete(item)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                      data-tip
                                      data-type="error"
                                      data-for="deletePoliceReport"
                                    >
                                      <AiFillDelete
                                        className="flex-shrink-0 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <ReactTooltip
                                      id="deletePoliceReport"
                                      place="top"
                                      effect="solid"
                                    >
                                      Delete Police Report
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
            {policeReportData?.insuredPoliceReports?.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={policeReportData.curPage - 1}
                pageCount={policeReportData.maxPage}
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
        <InsuredPoliceReportEditModal policeReport={editList} href={asPath} />
      ) : null}
      {showDetailModal ? (
        <DetailInsuredPoliceReportModal policeReport={detailList} />
      ) : null}
      {showDeleteModal ? (
        <DeleteInsuredPoliceReportModal
          policeReport={deleteList}
          href={asPath}
        />
      ) : null}
    </>
  );
};

export default ListInsuredPoliceReport;
