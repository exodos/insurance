import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { endOfToday, format } from "date-fns";
import SiteHeader from "@/layout/header";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import HitAndRunPoliceReportExport from "@/components/policereport/hitandrun/hit-and-run-export";

const ExportHitAndRunPoliceReport = gql`
  query ExportHitAndRunPoliceReport($dateFrom: String!, $dateTo: String!) {
    exportHitAndRunPoliceReport(dateFrom: $dateFrom, dateTo: $dateTo) {
      id
      incidentNumber
      incidentCause
      incidentDate
      incidentPlace
      incidentTime
      reportDate
      claimHitAndRuns {
        claimNumber
      }
      branchs {
        branchName
      }
      policeBranch {
        branchName
      }
      trafficPolices {
        firstName
        mobileNumber
      }
    }
  }
`;

const ExportAdminHitAndRun = ({
      props,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
      loading: exportHitAndRunPoliceReportLoading,
      error: exportHitAndRunPoliceReportError,
      data: exportHitAndRunPoliceReportData,
    },
  ] = useLazyQuery(ExportHitAndRunPoliceReport);

  if (exportHitAndRunPoliceReportData) {
    slicedValue =
      exportHitAndRunPoliceReportData?.exportHitAndRunPoliceReport?.slice(
        0,
        size
      );
  }
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Export Hit And Run Police Report Page"}
        content={"Third Party Insurance Export Hit And Run Police Report Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Export Hit And Run Police Report
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
                {exportHitAndRunPoliceReportError && (
                  <div className="px-1 sm:px-2 lg:px-4">
                    <div className="mt-2 mb-5 flex flex-col">
                      <div className="sm:col-span-2 sm:flex sm:justify-center mt-2">
                        <h3 className="text-eRed font-bold text-lg">
                          {exportHitAndRunPoliceReportError.message}
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-10 ml-10">
                {exportHitAndRunPoliceReportData?.exportUnInsuredPoliceReport
                  ?.length <= 0 && (
                  <div className="px-1 sm:px-2 lg:px-4">
                    <div className="mt-2 mb-5 flex flex-col">
                      <div className="sm:col-span-2 sm:flex sm:justify-center mt-2">
                        <h3 className="text-eRed font-bold text-lg">
                          No Police Report data found to export!! Please check
                          your input
                        </h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {exportHitAndRunPoliceReportData?.exportHitAndRunPoliceReport
                ?.length > 0 && (
                <>
                  <div className="pt-1">
                    <div className="flex justify-center pt-1">
                      <HitAndRunPoliceReportExport
                        policeReports={
                          exportHitAndRunPoliceReportData.exportHitAndRunPoliceReport
                        }
                      />
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
                                  Incident Number
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Incident Cause
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Incident Place
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Incident Time
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Defendant
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Police Station
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Traffic Police Name
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Traffic Police Phone
                                </th>
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
                                  Incident Date
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                  Report Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {slicedValue.length > 0 &&
                                slicedValue.map((item: any, i: any) => (
                                  <tr key={item?.id}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.incidentNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.incidentCause}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.incidentPlace}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.incidentTime}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.branchs?.branchName}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.policeBranch?.branchName}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.trafficPolices?.firstName}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.trafficPolices?.mobileNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {item?.claimHitAndRuns?.claimNumber}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {format(
                                        new Date(item.incidentDate),
                                        "yyyy-MM-dd"
                                      )}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                                      {format(
                                        new Date(item.reportDate),
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

  return {
    props: {
      session,
    },
  };
};

export default ExportAdminHitAndRun;
