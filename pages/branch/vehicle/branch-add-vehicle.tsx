import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoIosAddCircle } from "react-icons/io";
import ReactTooltip from "react-tooltip";
import { useRouter } from "next/router";
import { changePhone } from "@/lib/config";
import BranchAddVehicleModal from "@/components/vehicle/branch-add-vehicle";

const InsuredBranchByMobileNumber = gql`
  query InsuredBranchByMobileNumber(
    $mobileNumber: String!
    $branchId: String!
  ) {
    insuredBranchByMobileNumber(
      mobileNumber: $mobileNumber
      branchId: $branchId
    ) {
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
      branchs {
        id
        branchName
      }
    }
    feedUniqueTariff {
      tariffVehicleType {
        id
        vehicleType
      }
      tariffVehicleSubType {
        id
        vehicleSubType
      }
      tariffVehicleDetail {
        id
        vehicleDetail
      }
      tariffVehicleUsage {
        id
        vehicleUsage
      }
      tariffVehicleCategory {
        id
        vehicleCategory
      }
    }
    plateCode {
      id
      code
    }
    regionCode {
      id
      regionApp
    }
  }
`;

const AddVehicleByBranch = ({
      branchId,
      orgId,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [formValues, setFormValues] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createList, setCreateList] = useState([]);

  const router = useRouter();
  const path = router.query.returnPage;
  // console.log(path);

  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;

  const initialValues = {
    mobileNumber: "",
  };

  const validate = Yup.object().shape({
    mobileNumber: Yup.string()
      .matches(phoneRegExp, "Phone Number Is Not Valid")
      .required("Phone Number Is Required"),
  });

  const [
    insuredData,
    {
      loading: insuredBranchByMobileNumberLoading,
      error: insuredBranchByMobileNumberError,
      data: insuredBranchByMobileNumberData,
    },
  ] = useLazyQuery(InsuredBranchByMobileNumber);

  // console.log(insuredByMobileNumberData?.insuredByMobileNumber);

  const handleAdd = (value: any) => {
    setShowCreateModal((prev) => !prev);
    setCreateList(value);
  };

  return (
    <>
      <Head>
        <title>Add Vehicle</title>
        <meta name="description" content="Third Party Insurance Add Vehicle" />
      </Head>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white mt-20 rounded-3xl">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Vehicle
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Please First Search Owner Or Insured
              </p>
            </div>
          </div>
          <Formik
            initialValues={formValues || initialValues}
            validationSchema={validate}
            onSubmit={(values: any) => {
              insuredData({
                variables: {
                  mobileNumber: changePhone(values.mobileNumber),
                  branchId: branchId,
                },
              });
            }}
          >
            <Form className="space-y-6 sm:space-y-5 sm:pt-8">
              <div className="grid grid-cols-2">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2">
                  <label
                    htmlFor="mobileNumber"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Mobile Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Field
                      type="text"
                      name="mobileNumber"
                      id="mobileNumber"
                      placeholder="Please enter mobile number"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    />
                    <div className="text-eRed text-sm italic mt-2">
                      <ErrorMessage name="mobileNumber" />
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Search
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
          <div className="px-10 ml-10">
            {insuredBranchByMobileNumberError && (
              <p className="mt-2 max-w-2xl text-lg font-medium text-eRed">
                {insuredBranchByMobileNumberError.message}
              </p>
            )}
          </div>
          <div className="px-10 ml-10">
            {insuredBranchByMobileNumberData?.insuredBranchByMobileNumber ===
              null && (
              <p className="mt-2 max-w-2xl text-lg font-medium text-eRed">
                No Vehicle Found!!{" "}
              </p>
            )}
          </div>

          {insuredBranchByMobileNumberData?.insuredBranchByMobileNumber && (
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
                              SubCity
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
                              <span className="sr-only">Create</span>
                            </th>
                            {/* <th
                              scope="col"
                              className="relative py-3 pl-3 pr-4 sm:pr-6"
                            >
                              <span className="sr-only">Import</span>
                            </th> */}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr
                            key={
                              insuredBranchByMobileNumberData
                                ?.insuredBranchByMobileNumber?.id
                            }
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.firstName
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.lastName
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.occupation
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.region
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.city
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.subCity
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.wereda
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.kebelle
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.houseNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                insuredBranchByMobileNumberData
                                  ?.insuredBranchByMobileNumber?.mobileNumber
                              }
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <>
                                <button
                                  onClick={() =>
                                    handleAdd(
                                      insuredBranchByMobileNumberData
                                        ?.insuredBranchByMobileNumber?.id
                                    )
                                  }
                                  className="inline-flex items-center"
                                  data-tip
                                  data-type="success"
                                  data-for="addVehicle"
                                >
                                  <IoIosAddCircle
                                    className="flex-shrink-0 h-6 w-6 text-lightGreen"
                                    aria-hidden="true"
                                  />
                                </button>
                                <ReactTooltip
                                  id="addVehicle"
                                  place="top"
                                  effect="solid"
                                >
                                  Add Vehicle
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

      {showCreateModal ? (
        <BranchAddVehicleModal
          regionCode={insuredBranchByMobileNumberData.regionCode}
          codeList={insuredBranchByMobileNumberData.plateCode}
          branchId={branchId}
          uniqueTariff={insuredBranchByMobileNumberData.feedUniqueTariff}
          href={path}
          insuredId={createList}
        />
      ) : null}
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
  } else if (
    session?.user?.memberships?.role !== "BRANCHADMIN" &&
    session?.user?.memberships?.role !== "MEMBER"
  ) {
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
      branchId: session.user.memberships.branchId,
      orgId: session.user.memberships.branchs.orgId,
    },
  };
};

export default AddVehicleByBranch;
