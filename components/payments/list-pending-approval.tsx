import format from "date-fns/format";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import { useSession } from "next-auth/react";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
import { BiShow } from "react-icons/bi";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import DetailPendingApproval from "./detail-pending-approal";
import NotificationContext from "@/store/notification-context";

const PaymentByRef = gql`
  query PaymentByRef($refNumber: String!) {
    paymentByRef(refNumber: $refNumber) {
      refNumber
      insureds {
        regNumber
        firstName
        lastName
        mobileNumber
      }
      certificates {
        certificateNumber
        status
        premiumTarif
        policies {
          policyNumber
          policyStartDate
          policyExpireDate
        }
        vehicles {
          plateNumber
        }
      }
    }
  }
`;

const UpdatePaymentStatus = gql`
  mutation UpdatePaymentStatus($refNumber: String!) {
    updatePaymentStatus(refNumber: $refNumber) {
      count
    }
  }
`;
const BulkUpdateStatus = gql`
  mutation BulkUpdateStatus($paymentRefNumber: [String]!) {
    bulkUpdateStatus(paymentRefNumber: $paymentRefNumber) {
      count
    }
  }
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ListPendingApprovalPayment = ({ paymentData, href }) => {
  const { data: session, status } = useSession();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailList, setDetailtList] = useState([]);
  const notificationCtx = useContext(NotificationContext);

  const [updatePaymentStatus] = useMutation(UpdatePaymentStatus);
  const [bulkUpdateStatus] = useMutation(BulkUpdateStatus);

  const checkbox: any = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState([]);

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

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPayment.length > 0 &&
      selectedPayment.length < paymentData.payments.length;
    setChecked(selectedPayment.length === paymentData.payments.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayment]);

  function toggleAll() {
    setSelectedPayment(checked || indeterminate ? [] : paymentData.payments);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
    // console.log(selectedIneligible);
  }

  const [
    paymentByrefData,
    {
      loading: paymentByRefLoading,
      error: paymentByRefError,
      data: paymentByRefData,
    },
  ] = useLazyQuery(PaymentByRef);

  const handleDetails = async (refNumber: any) => {
    const result = await paymentByrefData({
      variables: {
        refNumber: refNumber,
      },
    });

    if (result.data.paymentByRef) {
      console.log(result?.data?.paymentByRef);
      setShowDetailModal((prev) => !prev);
      setDetailtList(result.data.paymentByRef);
    }
  };

  const handleApprove = async (refNumber) => {
    await updatePaymentStatus({
      variables: {
        refNumber: refNumber,
      },
      onError: (error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      },
      onCompleted: (data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully Approved Payment",
          status: "success",
        });
      },
      update: (cache, { data }) => {
        const cacheId = cache.identify(data.message);
        cache.modify({
          fields: {
            messages: (existinFieldData, { toReference }) => {
              return [...existinFieldData, toReference(cacheId)];
            },
          },
        });
      },
    }).then(() => router.push(href));
  };

  const handleBulkApprove = async () => {
    const paymentRefNumber = selectedPayment.map((v) => v.refNumber);
    await bulkUpdateStatus({
      variables: {
        paymentRefNumber,
      },
      onError: (error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      },
      onCompleted: (data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully Approved Payment",
          status: "success",
        });
      },
      update: (cache, { data }) => {
        const cacheId = cache.identify(data.message);
        cache.modify({
          fields: {
            messages: (existinFieldData, { toReference }) => {
              return [...existinFieldData, toReference(cacheId)];
            },
          },
        });
      },
    }).then(() => router.push("href"));
  };

  return (
    <>
      <div className="px-1 sm:px-2 lg:px-4">
        <div className="mt-5 flex flex-col">
          <div className="relative overflow-hidden mb-3">
            {selectedPayment.length > 0 &&
              (session?.user?.memberships?.role === "SUPERADMIN" ||
                session?.user?.memberships?.role === "INSURER" ||
                session?.user?.memberships?.role === "BRANCHADMIN") && (
                <button
                  type="button"
                  className="mr-2 inline-flex items-center rounded-lg border border-gray-300 bg-lightBlue px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={handleBulkApprove}
                >
                  Bulk Approve
                </button>
              )}
          </div>
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-3xl">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="relative w-12 px-6 sm:w-16 sm:px-8"
                      >
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                          ref={checkbox}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
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
                        Reference Number
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
                        Insured regNumber
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
                        Branch Name
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
                        session?.user?.memberships?.role === "BRANCHADMIN") && (
                        <>
                          <th scope="col" className="relative py-3.5 sm:pr-1">
                            <span className="sr-only">Detail</span>
                          </th>
                          <th scope="col" className="relative py-3.5 sm:pr-1">
                            <span className="sr-only">Approve</span>
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paymentData?.payments?.length > 0 &&
                      paymentData?.payments?.map((item: any, i: any) => (
                        <tr
                          key={i}
                          className={
                            selectedPayment.includes(item)
                              ? "bg-gray-50"
                              : undefined
                          }
                        >
                          <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                            {selectedPayment.includes(item) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                              value={item.refNumber}
                              checked={selectedPayment.includes(item)}
                              onChange={(e) =>
                                setSelectedPayment(
                                  e.target.checked
                                    ? [...selectedPayment, item]
                                    : selectedPayment.filter((p) => p !== item)
                                )
                              }
                            />
                          </td>

                          <td
                            className={classNames(
                              "whitespace-nowrap px-3 py-4 text-sm font-medium",
                              selectedPayment.includes(item)
                                ? "text-indigo-600"
                                : "text-gray-900"
                            )}
                          >
                            {i + 1}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.refNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item.premiumTarif}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item?.insureds?.regNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item?.insureds?.mobileNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {item?.branchs.branchName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.createdAt), "MMM-dd-yyyy")}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(item.updatedAt), "MMM-dd-yyyy")}
                          </td>
                          {(session?.user?.memberships?.role === "SUPERADMIN" ||
                            session?.user?.memberships?.role === "INSURER" ||
                            session?.user?.memberships?.role ===
                              "BRANCHADMIN") && (
                            <>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <>
                                  <button
                                    onClick={() =>
                                      handleDetails(item?.refNumber)
                                    }
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
                                    onClick={() =>
                                      handleApprove(item?.refNumber)
                                    }
                                    className="text-indigo-600 hover:text-indigo-900"
                                    data-tip
                                    data-type="success"
                                    data-for="approvePayment"
                                  >
                                    <BsFillCheckCircleFill
                                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-lightGreen"
                                      aria-hidden="true"
                                    />
                                  </button>
                                  <ReactTooltip
                                    id="approvePayment"
                                    place="top"
                                    effect="solid"
                                  >
                                    Approve Payment
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
            {paymentData?.payments.length > 0 && (
              <ReactPaginate
                breakLabel={"..."}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                initialPage={paymentData.curPage - 1}
                pageCount={paymentData.maxPage}
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

      {showDetailModal ? <DetailPendingApproval payment={detailList} /> : null}
    </>
  );
};

export default ListPendingApprovalPayment;
