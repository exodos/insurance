import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactTooltip from "react-tooltip";
import Link from "next/link";
import { CgImport } from "react-icons/cg";

const InsuredAdminByRegNumber = gql`
  query InsuredAdminByRegNumber($regNumber: String!) {
    insuredAdminByRegNumber(regNumber: $regNumber) {
      id
      regNumber
      firstName
      lastName
      occupation
      region
      city
      subCity
      wereda
      kebelle
      houseNumber
      mobileNumber
      createdAt
      updatedAt
    }
  }
`;

const ImportVehicleByReg = ({ path }) => {
  const [formValues, setFormValues] = useState(null);

  const initialValues = {
    regNumber: "",
  };

  const validate = Yup.object().shape({
    regNumber: Yup.string().required("Registration Number Is Required"),
  });

  const [
    vehicleData,
    {
      loading: insuredAdminByRegNumberLoading,
      error: insuredAdminByRegNumberError,
      data: insuredAdminByRegNumberData,
    },
  ] = useLazyQuery(InsuredAdminByRegNumber);

  return (
    <>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white mt-20 rounded-3xl">
        <div className="space-y-8 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5"></div>
          <Formik
            initialValues={formValues || initialValues}
            validationSchema={validate}
            onSubmit={(values: any) => {
              vehicleData({
                variables: {
                  regNumber: values.regNumber,
                },
              });
            }}
          >
            <Form className="space-y-6 sm:space-y-5 sm:pt-8">
              <div className="max-w-[80%] mx-auto px-4">
                <div className="grid grid-cols-2">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2">
                    <label
                      htmlFor="regNumber"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Registration Number
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <Field
                        type="text"
                        name="regNumber"
                        placeholder="Please enter Registration number"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                      />
                      <div className="text-eRed text-sm italic mt-2">
                        <ErrorMessage name="regNumber" />
                      </div>
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2">
                    <button
                      type="submit"
                      className="sm:mt-1 ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
          <div className="px-10 ml-10">
            {insuredAdminByRegNumberError && (
              <p className="mt-2 max-w-2xl text-lg font-medium text-eRed">
                {insuredAdminByRegNumberError.message}
              </p>
            )}
          </div>
          <div className="px-10 ml-10">
            {insuredAdminByRegNumberData?.insuredAdminByRegNumber === null && (
              <p className="mt-2 max-w-2xl text-lg font-medium text-eRed">
                No Data Found With The Provided Registration Number !!
              </p>
            )}
          </div>
          {insuredAdminByRegNumberData?.insuredAdminByRegNumber && (
            <div className="px-1 sm:px-2 lg:px-4">
              <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
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
                              Occupation
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Region
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              City
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Sub City
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Wereda
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Kebelle
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              House Number
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Mobile Number
                            </th>
                            <th
                              scope="col"
                              className="relative py-3 pl-3 pr-4 sm:pr-6"
                            >
                              <span className="sr-only">Import</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr
                            key={
                              insuredAdminByRegNumberData
                                ?.insuredAdminByRegNumber?.id
                            }
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.regNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.firstName
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.lastName
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.occupation
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.region
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.city
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.subCity
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.wereda
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.kebelle
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.houseNumber
                              }
                            </td>
                            <td className="whitespace-normal py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredAdminByRegNumberData
                                  ?.insuredAdminByRegNumber?.mobileNumber
                              }
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <>
                                <Link
                                  href={{
                                    pathname:
                                      "/admin/certificate/admin-import-insurance",
                                    query: {
                                      insured:
                                        insuredAdminByRegNumberData
                                          ?.insuredAdminByRegNumber?.id,
                                      returnPage: path,
                                    },
                                  }}
                                  passHref
                                  legacyBehavior
                                >
                                  <button
                                    className="inline-flex items-center"
                                    data-tip
                                    data-type="warning"
                                    data-for="importVehicle"
                                  >
                                    <CgImport
                                      className="flex-shrink-0 h-6 w-6 text-lightGreen"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </Link>
                                <ReactTooltip
                                  id="importVehicle"
                                  place="top"
                                  effect="solid"
                                >
                                  Import Vehicle
                                </ReactTooltip>
                              </>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImportVehicleByReg;
