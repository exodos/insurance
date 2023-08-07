import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { useState } from "react";
import { useRouter } from "next/router";
import VehicleByRegNumber from "@/components/common/vehicle-by-reg";
import { gql } from "apollo-server-micro";
import { initializeApollo } from "@/lib/apollo";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import VehicleByPlateNumber from "@/components/common/vehicle-plate";
import VehicleByMobileNumber from "@/components/common/vehicle-by-mobile";
import { useLazyQuery } from "@apollo/client";
import SiteHeader from "@/components/layout/header";

const ListInsuranceOrganization = gql`
  query ListInsuranceOrganization($description: OrgDesc!) {
    listInsuranceOrganization(description: $description) {
      id
      orgName
    }
    feedUniqueTariff {
      tariffVehicleType {
        id
        vehicleType
      }
    }
    regionCode {
      id
      regionApp
      regionName
    }
    plateCode {
      id
      code
    }
  }
`;

const InsuredcertificateCountReport = gql`
  query InsuredcertificateCountReport(
    $insuranceType: String!
    $filter: String!
    $reportFor: String!
    $vehicleSearch: String!
  ) {
    insuredcertificateCountReport(
      insuranceType: $insuranceType
      filter: $filter
      reportFor: $reportFor
      vehicleSearch: $vehicleSearch
    ) {
      count
    }
  }
`;

const InsuranceCoverageReport = ({
  insurancedata,
  reportFor,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [orgOptions, setOrgOptions] = useState(
    insurancedata?.listInsuranceOrganization
  );
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState(
    insurancedata?.feedUniqueTariff?.tariffVehicleType
  );
  const [regionOptions, setRegionOptions] = useState(insurancedata?.regionCode);
  const [plateCodeOptions, setPlateCodeOptions] = useState(
    insurancedata?.plateCode
  );
  // const [requireField, setRequireField] = useState("");

  const insuranceTypeOptions = [
    { value: "New", label: "New" },
    { value: "Renewal", label: "Renewal" },
    { value: "NotRenewed", label: "Not Renewed" },
  ];
  const reportCategoryOptions = [
    { value: "vehicleType", label: "By Vehicle Type" },
    { value: "region", label: "By Region" },
    { value: "plateCode", label: "By Vehicle Plate Code" },
    { value: "insurance", label: "By Insurance" },
  ];

  const initialValues = {
    insuranceType: "",
    vehicleSearch: "",
    filter: "",
  };

  // const validate = Yup.object().shape({
  //   insuranceType: Yup.string().required("Insurance Type Is Required"),
  //   reportFor: Yup.string().required("Report Category Is Required"),
  //   vehicleType: Yup.string()
  //     .ensure()
  //     .when("reportCategory", {
  //       is: "vehicle type",
  //       then: Yup.string().required("Vehicle Type Is Required"),
  //     }),
  //   region: Yup.string()
  //     .ensure()
  //     .when("reportCategory", {
  //       is: "region",
  //       then: Yup.string().required("Region Is Required"),
  //     }),
  //   plateCode: Yup.string()
  //     .ensure()
  //     .when("reportCategory", {
  //       is: "plate code",
  //       then: Yup.string().required("Plate Code Is Required"),
  //     }),
  //   insurance: Yup.string()
  //     .ensure()
  //     .when("reportCategory", {
  //       is: "insurance",
  //       then: Yup.string().required("Plate Code Is Required"),
  //     }),
  // });

  const validate = Yup.object().shape({
    insuranceType: Yup.string().required("Insurance Type Is Required"),
    vehicleSearch: Yup.string().required("Search Criteria Is Required"),
    filter: Yup.string().required("This Field Is Required"),
  });
  const [formValues, setFormValues] = useState(null);

  const [
    insuredcertificateData,
    {
      loading: insuredcertificateCountReportLoading,
      error: insuredcertificateCountReportError,
      data: insuredcertificateCountReportData,
    },
  ] = useLazyQuery(InsuredcertificateCountReport, {
    fetchPolicy: "cache-and-network",
  });

  const onSubmit = async (values) => {
    console.log(values);
  };

  console.log(insuredcertificateCountReportData?.insuredcertificateCountReport);

  return (
    <>
      <SiteHeader
        title={`${reportFor} Insurance Coverage Report`}
        content={`${reportFor} Insurance Coverage Report`}
      />
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white mt-24 rounded-3xl">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 capitalize">
                {reportFor} Insurance Coverage Report
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 capitalize">
                please Select The Catagory
              </p>
            </div>
          </div>
          <Formik
            initialValues={formValues || initialValues}
            validationSchema={validate}
            onSubmit={(values: any) => {
              insuredcertificateData({
                variables: {
                  reportFor: reportFor,
                  insuranceType: values.insuranceType,
                  vehicleSearch: values.vehicleSearch,
                  filter: values.filter,
                },
              });
            }}
            enableReinitialize={true}
            // onSubmit={onSubmit}
            // enableReinitialize={true}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6 sm:space-y-5 sm:pt-8">
                <div className="max-w-[90%] mx-auto px-4">
                  <div className="grid grid-cols-4">
                    <div className="grid-cols-1 mx-10">
                      <label
                        htmlFor="insuranceType"
                        className="block text-base font-medium leading-6 text-gray-900"
                      >
                        Insurance Status
                      </label>
                      <Field
                        as="select"
                        name="insuranceType"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option disabled value="">
                          Select Insurance Status
                        </option>
                        {insuranceTypeOptions.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <div className="text-eRed text-sm italic mt-2">
                        <ErrorMessage name="insuranceType" />
                      </div>
                    </div>
                    <div className="grid-cols-1 mx-10">
                      <label
                        htmlFor="vehicleSearch"
                        className="block text-base font-medium leading-6 text-gray-900"
                      >
                        Search By
                      </label>
                      <Field
                        as="select"
                        name="vehicleSearch"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => {
                          setFieldValue("vehicleSearch", e.target.value);
                          // resetFiled(e.target.value);
                          // setRequireField(e.target.value);
                        }}
                      >
                        <option disabled value="">
                          Select Report Category
                        </option>
                        {reportCategoryOptions.map((option: any) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <div className="text-eRed text-sm italic mt-2">
                        <ErrorMessage name="vehicleSearch" />
                      </div>
                    </div>
                    {values.vehicleSearch && (
                      <>
                        {values.vehicleSearch === "vehicleType" && (
                          <div className="grid-cols-1">
                            <label
                              htmlFor="filter"
                              className="block text-base font-medium leading-6 text-gray-900"
                            >
                              Vehicle Type
                            </label>
                            <Field
                              as="select"
                              name="filter"
                              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              <option disabled value="">
                                Select Vehicle Type
                              </option>
                              {vehicleTypeOptions.map((option: any) => (
                                <option
                                  key={option.id}
                                  value={option.vehicleType}
                                >
                                  {option.vehicleType}
                                </option>
                              ))}
                            </Field>
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="filter" />
                            </div>
                          </div>
                        )}
                        {values.vehicleSearch === "region" && (
                          <div className="grid-cols-1">
                            <label
                              htmlFor="filter"
                              className="block text-base font-medium leading-6 text-gray-900"
                            >
                              region
                            </label>
                            <Field
                              as="select"
                              name="filter"
                              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              <option disabled value="">
                                Select Region
                              </option>
                              {regionOptions.map((option: any) => (
                                <option
                                  key={option.id}
                                  value={option.regionName}
                                >
                                  {option.regionName}
                                </option>
                              ))}
                            </Field>
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="filter" />
                            </div>
                          </div>
                        )}
                        {values.vehicleSearch === "plateCode" && (
                          <div className="grid-cols-1">
                            <label
                              htmlFor="filter"
                              className="block text-base font-medium leading-6 text-gray-900"
                            >
                              Plate Code
                            </label>
                            <Field
                              as="select"
                              name="filter"
                              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              <option disabled value="">
                                Select Plate Code
                              </option>
                              {plateCodeOptions.map((option: any) => (
                                <option key={option.id} value={option.code}>
                                  {option.code}
                                </option>
                              ))}
                            </Field>
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="filter" />
                            </div>
                          </div>
                        )}
                        {values.vehicleSearch === "insurance" && (
                          <div className="grid-cols-1">
                            <label
                              htmlFor="filter"
                              className="block text-base font-medium leading-6 text-gray-900"
                            >
                              Insurance Company
                            </label>
                            <Field
                              as="select"
                              name="filter"
                              className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            >
                              <option disabled value="">
                                Select Plate Code
                              </option>
                              {orgOptions.map((option: any) => (
                                <option key={option.id} value={option.orgName}>
                                  {option.orgName}
                                </option>
                              ))}
                            </Field>
                            <div className="text-eRed text-sm italic mt-2">
                              <ErrorMessage name="filter" />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    <div className="grid-cols-1 mx-10 mt-8">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-lightGreen py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-depGreen focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        {insuredcertificateCountReportError && (
          <div className="space-y-6 sm:space-y-5 sm:pt-8">
            <div className="max-w-[85%] mx-auto px-4">
              <h1 className="text-eRed font-bold text-lg">
                {insuredcertificateCountReportError.message}
              </h1>
            </div>
          </div>
        )}

        {insuredcertificateCountReportData &&
          insuredcertificateCountReportData?.insuredcertificateCountReport
            ?.count === 0 && (
            <div className="space-y-6 sm:space-y-5 sm:pt-8">
              <div className="max-w-[85%] mx-auto px-4">
                <h1 className="text-eRed font-medium mx-10 text-lg items-center">
                  No data Found
                </h1>
              </div>
            </div>
          )}

        {insuredcertificateCountReportData &&
          insuredcertificateCountReportData?.insuredcertificateCountReport
            ?.count !== 0 && (
            <div className="space-y-6 sm:space-y-5 sm:pt-8">
              <div className="max-w-[85%] mx-auto px-4">
                <h1 className="font-medium mx-10 text-lg items-center">
                  Number of vehicle having 3rd party insurance coverage with in
                  a {reportFor.slice(0, -2)} is{" "}
                  {
                    insuredcertificateCountReportData
                      ?.insuredcertificateCountReport?.count
                  }
                </h1>
              </div>
            </div>
          )}
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
  } else if (session.user?.memberships?.role !== "SUPERADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { query } = context;
  const reportFor = query.reportFor;

  const apolloClient = initializeApollo();

  const { data: insurancedata } = await apolloClient.query({
    query: ListInsuranceOrganization,
    variables: {
      description: "INSURANCE",
    },
  });

  return {
    props: {
      session,
      insurancedata,
      reportFor,
    },
  };
};

export default InsuranceCoverageReport;
