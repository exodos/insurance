import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql, useLazyQuery } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { endOfToday, format } from "date-fns";
import { useRouter } from "next/router";
import SiteHeader from "@/layout/header";
import AddUserModal from "@/components/users/add-user";
import UserExport from "@/components/users/user-export";
import ClaimExport from "@/components/claim/claim-export";

const UserQuery = gql`
  query ListAllBranch {
    listAllBranch {
      id
      branchName
    }
    roleList {
      id
      role
    }
  }
`;

const ExportClaimQuery = gql`
  query ExportClaim($dateFrom: String!, $dateTo: String!) {
    exportClaim(dateFrom: $dateFrom, dateTo: $dateTo) {
      id
      claimNumber
      damageEstimate
      claimStatus
      claimedAt
      updatedAt
      insuredPoliceReports {
        incidentNumber
      }
      insureds {
        regNumber
        firstName
        lastName
        mobileNumber
      }
      vehicles {
        plateNumber
      }
      branchs {
        branchName
      }
      certificates {
        certificateNumber
      }
    }
  }
`;

const ExportAdminClaim = ({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [formValues, setFormValues] = useState(null);

  let slicedValue = null;
  const size = 10;
  const initialValues = {
    dateFrom: "",
    dateTo: "",
  };

  const validate = Yup.object().shape({
    dateFrom: Yup.date()
      .required("Start Date is required")
      .max(Yup.ref("dateTo"), "Start Date Should be less than end date"),
    dateTo: Yup.date()
      .required("End Date Is Required")
      .max(endOfToday(), "Date Should Be Less Than Or Equal To Today"),
  });

  const [
    exportData,
    {
      loading: exportClaimQueryLoading,
      error: exportClaimQueryError,
      data: exportClaimQueryData,
    },
  ] = useLazyQuery(ExportClaimQuery);

  if (exportClaimQueryData) {
    slicedValue = exportClaimQueryData?.exportClaim?.slice(0, size);
  }
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Users Page"}
        content={"Third Party Insurance Users Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Export Claims
              </h1>
            </div>
          </div>
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="text-gray-900 body-font overflow-hidden bg-white border-2 rounded-3xl border-gray-200 mt-5">
              <div className="container px-2 py-5 mx-auto">
                <Formik
                  initialValues={formValues || initialValues}
                  validationSchema={validate}
                  onSubmit={(values: any) => {
                    exportData({
                      variables: {
                        dateFrom: values.dateFrom,
                        dateTo: values.dateTo,
                      },
                    });
                  }}
                  enableReinitialize={true}
                >
                  <Form className="space-y-6">
                    <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                      <div>
                        <h3 className="text-lg leading-6 font-semibold text-gray-600">
                          Please Select Start And End Dates To Export
                        </h3>
                      </div>
                    </div>
                    <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                      <div className="mt-5 md:mt-0 md:col-span-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 sm:col-span-1">
                            <label
                              htmlFor="dateFrom"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              From
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="date"
                              name="dateFrom"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="dateFrom" />
                            </div>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label
                              htmlFor="dateTo"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              To
                              <span className="text-eRed">*</span>
                            </label>
                            <Field
                              type="date"
                              name="dateTo"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="dateTo" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-5">
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-3 px-20 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white bg-lightGreen hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Saerch
                        </button>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>

              <div className="px-10 ml-10">
                {exportClaimQueryError && (
                  <div className="px-1 sm:px-2 lg:px-4">
                    <div className="mt-2 mb-5 flex flex-col">
                      <div className="sm:col-span-2 sm:flex sm:justify-center mt-2">
                        <h3 className="text-eRed font-bold text-lg">
                          {exportClaimQueryError.message}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-10 ml-10">
                {exportClaimQueryData?.exportClaim?.length <= 0 && (
                  <div className="px-1 sm:px-2 lg:px-4">
                    <div className="mt-2 mb-5 flex flex-col">
                      <div className="sm:col-span-2 sm:flex sm:justify-center mt-2">
                        <h3 className="text-eRed font-bold text-lg">
                          No Claim data found to export!! Please check your
                          input
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {exportClaimQueryData?.exportClaim?.length > 0 && (
                <>
                  <div className="pt-1">
                    <div className="flex justify-center pt-1">
                      <ClaimExport claims={exportClaimQueryData.exportClaim} />
                    </div>
                  </div>
                  <div className="px-1 sm:px-2 lg:px-4">
                    <div className="mt-5 flex flex-col">
                      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Claim Number
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Estimated Damage
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
                                  Registration Number
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  First Name
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Last Name
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Mobile Number
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Plate Number
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Branch
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Certificate Number
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Claimed At
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Update At
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {slicedValue.length > 0 &&
                                slicedValue.map((item: any, i: any) => (
                                  <tr key={item?.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.claimNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.damageEstimate}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {
                                        item?.insuredPoliceReports
                                          ?.incidentNumber
                                      }
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.insureds?.regNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.insureds?.firstName}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.insureds?.lastName}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.insureds?.mobileNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.vehicles?.plateNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.branchs?.branchName}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.certificates?.certificateNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {format(
                                        new Date(item.claimedAt),
                                        "yyyy-MM-dd"
                                      )}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {format(
                                        new Date(item.updatedAt),
                                        "yyyy-MM-dd"
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  } else if (session.user.memberships.role !== "SUPERADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: UserQuery,
  });

  return {
    props: {
      session,
      data,
    },
  };
};

export default ExportAdminClaim;
