import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { gql, useLazyQuery } from "@apollo/client";
import { FormEvent, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { IoIosAddCircle } from "react-icons/io";
import ReactTooltip from "react-tooltip";
import AddVehicleModal from "@/components/vehicle/add-vehicle";
import { useRouter } from "next/router";
import { changePhone } from "@/lib/config";
import { initializeApollo } from "@/lib/apollo";
import AddCertificateModal from "@/components/certificate/add-certificate";

const VehicleByPlateNumber = gql`
  query VehicleByPlateNumber($plateNumber: String!) {
    vehicleByPlateNumber(plateNumber: $plateNumber) {
      id
      plateNumber
      engineNumber
      chassisNumber
      vehicleType
      vehicleSubType
      vehicleDetails
      vehicleUsage
      vehicleCategory
      premiumTarif
      passengerNumber
      isInsured
    }
  }
`;

const FetchFirst = gql`
  query PlateCode {
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

const AddCertificate = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [formValues, setFormValues] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createList, setCreateList] = useState([]);

  const router = useRouter();
  const path = router.query.returnPage;
  // console.log(path);

  const plateNumberRegExp = /^([A-Da-d])?\d{5}$/;

  const initialValues = {
    plateCode: "",
    plateRegion: "",
    plateNumber: "",
  };

  const validate = Yup.object().shape({
    plateCode: Yup.string().required("Plate Code Is Required"),
    plateRegion: Yup.string().required("Plate Region Is Required"),
    plateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Plate Number Is Required"),
  });

  const [
    vehicleData,
    {
      loading: vehicleByPlateNumberLoading,
      error: vehicleByPlateNumberError,
      data: vehicleByPlateNumberData,
    },
  ] = useLazyQuery(VehicleByPlateNumber);

  // console.log(insuredByMobileNumberData?.insuredByMobileNumber);

  const handleAdd = (value: any) => {
    setShowCreateModal((prev) => !prev);
    setCreateList(value);
  };

  return (
    <>
      <Head>
        <title>Add Certificate</title>
        <meta
          name="description"
          content="Third Party Insurance Add Certificate"
        />
      </Head>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white mt-20 rounded-3xl">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Certificate
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Please First Search Vehicle
              </p>
            </div>
          </div>
          <Formik
            initialValues={formValues || initialValues}
            validationSchema={validate}
            onSubmit={(values: any) => {
              vehicleData({
                variables: {
                  plateNumber: `${values.plateCode}${values.plateRegion}${values.plateNumber}`,
                },
              });
            }}
            // enableReinitialize={true}
          >
            <Form className="space-y-6 sm:space-y-5 sm:pt-8">
              <div className="grid grid-cols-4">
                <div className="sm:grid sm:grid-cols-4 sm:gap-1 sm:pt-2">
                  <label
                    htmlFor="plateCode"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Plate Code
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Field
                      as="select"
                      name="plateCode"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    >
                      <option disabled value="">
                        Select Plate Code
                      </option>
                      {data.plateCode.map((option: any) => (
                        <option key={option.code} value={option.code}>
                          {option.code}
                        </option>
                      ))}
                    </Field>
                    <div className="text-eRed text-sm italic mt-2">
                      <ErrorMessage name="plateCode" />
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-4 sm:gap-1 sm:pt-2">
                  <label
                    htmlFor="plateRegion"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Plate Region
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Field
                      as="select"
                      name="plateRegion"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    >
                      <option disabled value="">
                        Select Plate Region
                      </option>
                      {data.regionCode.map((option: any) => (
                        <option key={option.regionApp} value={option.regionApp}>
                          {option.regionApp}
                        </option>
                      ))}
                    </Field>
                    <div className="text-eRed text-sm italic mt-2">
                      <ErrorMessage name="plateRegion" />
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-4 sm:gap-1 sm:pt-2">
                  <label
                    htmlFor="plateNumber"
                    className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Plate Number
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <Field
                      type="text"
                      name="plateNumber"
                      placeholder="Enter Vehicle Plate Number"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    />
                    <div className="text-eRed text-sm italic mt-2">
                      <ErrorMessage name="plateNumber" />
                    </div>
                  </div>
                </div>
                <div className="sm:grid sm:grid-cols-4 sm:items-start sm:gap-1 sm:pt-2">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-14 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Search
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
          <div className="px-10 ml-10">
            {vehicleByPlateNumberError && (
              <p className="mt-2 max-w-2xl text-lg font-medium text-eRed">
                {vehicleByPlateNumberError.message}
              </p>
            )}
          </div>
          <div className="px-10 ml-10">
            {vehicleByPlateNumberData?.vehicleByPlateNumber === null && (
              <p className="mt-2 max-w-2xl text-lg font-medium text-eRed">
                No Vehicle Found Or Vehicle Is Not Approved Yet!!
              </p>
            )}
          </div>

          {vehicleByPlateNumberData?.vehicleByPlateNumber && (
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
                              Plate Number
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Engine Number
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Chassis Number
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Type Of Vehicle
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Sub Type Of Vehicle
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Detail Of Vehicle
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Usage
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Passenger Number
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Premium Tarif
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Insurance Status
                            </th>
                            <th
                              scope="col"
                              className="relative py-3 pl-3 pr-4 sm:pr-6"
                            >
                              <span className="sr-only">Create</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          <tr
                            key={
                              vehicleByPlateNumberData?.vehicleByPlateNumber?.id
                            }
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.plateNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.engineNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.chassisNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.vehicleType
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.vehicleSubType
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.vehicleDetails
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.vehicleUsage
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.vehicleCategory
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.passengerNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.premiumTarif
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleByPlateNumberData?.vehicleByPlateNumber
                                  ?.isInsured
                              }
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <>
                                <button
                                  onClick={() =>
                                    handleAdd(
                                      vehicleByPlateNumberData
                                        ?.vehicleByPlateNumber?.id
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
        <AddCertificateModal
          vehicle={vehicleByPlateNumberData?.vehicleByPlateNumber}
          href={path}
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
        destination: "/auth/sign-in",
      },
    };
  } else if (session.user.adminRestPassword) {
    return {
      redirect: {
        destination: "/user/force-reset",
        permanent: false,
      },
    };
  }
  // const { query } = context;
  // const page = query.returnPage;
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FetchFirst,
  });

  return {
    props: {
      session,
      data,
      // page,
    },
  };
};

export default AddCertificate;
