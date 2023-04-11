import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { initializeApollo } from "../../../lib/apollo";
import { authOptions } from "../../api/auth/[...nextauth]";
import SiteHeader from "@/components/layout/header";

import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ExportThirdPartyLog = gql`
  query ExportThirdPartyLog(
    $branchName: String
    $dateFrom: String!
    $dateTo: String!
  ) {
    exportThirdPartyLog(
      branchName: $branchName
      dateFrom: $dateFrom
      dateTo: $dateTo
    ) {
      id
      userEmail
      action
      mode
      oldValue
      newValue
      timeStamp
      branchCon {
        branchName
      }
    }
  }
`;

const getBranchName = gql`
  query ListAllBranch {
    listAllBranch {
      id
      branchName
    }
  }
`;

const ExportLogs = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [formValues, setFormValues] = useState(null);

  const initialValues = {
    branchName: "",
    dateFrom: "",
    dateTo: "",
  };

  const validate = Yup.object().shape({
    dateFrom: Yup.date()
      .required("Date From Is Required")
      .max(Yup.ref("dateTo"), "Date From must be earlier than the Date To"),
    dateTo: Yup.date()
      .required("Date To Is Required")
      .max(new Date(), "Date Should Be Less Than Today"),
  });

  const [
    exportData,
    {
      loading: exportThirdPartyLogLogLoading,
      error: exportThirdPartyLogErrot,
      data: exportThirdPartyLogData,
    },
  ] = useLazyQuery(ExportThirdPartyLog);

  if (exportThirdPartyLogLogLoading) return <p>Loading ...</p>;

  //   if (error) return `Error! ${error}`;

  console.log(exportThirdPartyLogData?.exportThirdPartyLog);

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Export Logs"}
        content={"Third Party Insurance Export Logs"}
      />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-14 sm:px-2 lg:px-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Operation Logs
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Operation Logs
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-2">
            <div className="container px-2 py-5 mx-auto">
              <Formik
                initialValues={formValues || initialValues}
                validationSchema={validate}
                onSubmit={(values: any) => {
                  exportData({
                    variables: {
                      //   branchName: values.branchName,
                      dateFrom: values.dateFrom,
                      dateTo: values.dateTo,
                    },
                  });
                }}
                // enableReinitialize={true}
              >
                <Form className="space-y-6 divide-y divide-gray-200">
                  <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="md:grid md:grid-cols-3 md:gap-6">
                      <div className="mt-5 md:mt-0 md:col-span-3">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="branchName"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Branch Name
                            </label>
                            <Field
                              type="text"
                              name="branchName"
                              placeholder="Enter Branch Name"
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="dateFrom"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Date From <span className="text-eRed">*</span>
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
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="dateTo"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Date To
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
                  </div>
                  <div className="sm:col-span-2 sm:flex sm:justify-center pb-3">
                    <button
                      type="submit"
                      className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-lightGreen px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
            {exportThirdPartyLogErrot && (
              <div className="px-1 sm:px-2 lg:px-4">
                <div className="mt-8 flex flex-col">
                  <div className="sm:col-span-2 sm:flex sm:justify-center mt-2">
                    <h3 className="text-eRed font-bold text-lg">
                      {exportThirdPartyLogErrot.message}
                    </h3>
                  </div>
                </div>
              </div>
            )}
            {exportThirdPartyLogData &&
              exportThirdPartyLogData?.exportThirdPartyLog?.length <= 0 && (
                <div className="px-1 sm:px-2 lg:px-4">
                  <div className="mt-8 flex flex-col">
                    <div className="sm:col-span-2 sm:flex sm:justify-center mt-2">
                      <h3 className="text-eRed font-bold text-lg">
                        No Data Found To Export!! Please Try Again
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            {exportThirdPartyLogData?.exportThirdPartyLog?.length > 0 && (
              <div className="px-1 sm:px-2 lg:px-4">
                <div className="mt-8 flex flex-col">
                  <div className="sm:col-span-2 sm:flex sm:justify-start mt-2">
                    {/* <ExportOperationLogs
                        logs={data.exportOperationLog}
                        mode={dateMode}
                        action={actionMode}
                      /> */}
                  </div>
                </div>
              </div>
            )}
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
        destination: "/auth/sign-in",
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

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 10;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: getBranchName,
  });

  return {
    props: {
      session,
      data,
    },
  };
};

export default ExportLogs;
