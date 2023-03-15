import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoIosAddCircle } from "react-icons/io";
import ReactTooltip from "react-tooltip";
import AddCertificateModal from "../certificate/add-certificate";
import AddOrUpdateCertificateModal from "../certificate/add-update-certificate";

const VehicleBranchByPlateNumber = gql`
  query GetVehicleByPlateNumber($plateNumber: String!) {
    getVehicleByPlateNumber(plateNumber: $plateNumber) {
      id
      plateNumber
      engineNumber
      chassisNumber
      vehicleModel
      bodyType
      horsePower
      manufacturedYear
      vehicleType
      vehicleSubType
      vehicleDetails
      vehicleUsage
      vehicleCategory
      premiumTarif
      passengerNumber
      carryingCapacityInGoods
      purchasedYear
      dutyFreeValue
      dutyPaidValue
      vehicleStatus
      isInsured
      createdAt
      updatedAt
      branchs {
        id
      }
    }
  }
`;

const VehicleByPlateNumber = ({ code, region, branchId, path }) => {
  const [formValues, setFormValues] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createList, setCreateList] = useState([]);
  const [codeOptions, setCodeOptions] = useState(code);
  const [regionOptions, setRegionOptions] = useState(region);

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
      loading: vehicleBranchByPlateNumberLoading,
      error: vehicleBranchByPlateNumberError,
      data: vehicleBranchByPlateNumberData,
    },
  ] = useLazyQuery(VehicleBranchByPlateNumber);

  const handleAdd = (value: any) => {
    setShowCreateModal((prev) => !prev);
    setCreateList(value);
  };

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
                  plateNumber: `${values.plateCode}${values.plateRegion}${values.plateNumber}`,
                },
              });
            }}
          >
            <Form className="space-y-6 sm:space-y-5 sm:pt-8">
              <div className="max-w-[95%] mx-auto px-1">
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
                        {codeOptions.map((option: any) => (
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
                        {regionOptions.map((option: any) => (
                          <option
                            key={option.regionApp}
                            value={option.regionApp}
                          >
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
              </div>
            </Form>
          </Formik>
          <div className="px-10 ml-10">
            {vehicleBranchByPlateNumberError && (
              <p className="mt-2 max-w-2xl text-lg font-medium text-eRed">
                {vehicleBranchByPlateNumberError.message}
              </p>
            )}
          </div>
          <div className="max-w-[80%] mx-auto px-4">
            {vehicleBranchByPlateNumberData?.getVehicleByPlateNumber ===
              null && (
              <p className="mt-2 max-w-2xl text-base font-medium text-eRed">
                No Data Found Or Vehicle insurance is still valid!!
              </p>
            )}
          </div>
          {vehicleBranchByPlateNumberData?.getVehicleByPlateNumber && (
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
                              Vehicle Model
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Body Type
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Horse Power
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Manufactured Year
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Vehicle Type
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Vehicle Sub Type
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Vehicle Details
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
                              Premium Tarif
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
                              Carrying Capacity
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Purchased Year
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Duty Free Value
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Duty Paid Value
                            </th>
                            <th
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              Vehicle Status
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
                              vehicleBranchByPlateNumberData
                                ?.getVehicleByPlateNumber.id
                            }
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.plateNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.engineNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.chassisNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.vehicleModel
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.bodyType
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.horsePower
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.manufacturedYear
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.vehicleType
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.vehicleSubType
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.vehicleDetails
                              }
                            </td>
                            <td className="whitespace-normal py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.vehicleUsage
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.vehicleCategory
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.premiumTarif
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.passengerNumber
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber
                                  ?.carryingCapacityInGoods
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.purchasedYear
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.dutyFreeValue
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.dutyPaidValue
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.vehicleStatus
                              }
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6">
                              {
                                vehicleBranchByPlateNumberData
                                  ?.getVehicleByPlateNumber?.isInsured
                              }
                            </td>
                            {/* {((item?.certificates &&
                                    item?.certificates?.policies &&
                                    checkPolicy(
                                      item.certificates.policies
                                        .policyExpireDate
                                    )) ||
                                    item?.isInsured === "NOTINSURED") && ( */}
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <>
                                <button
                                  onClick={() =>
                                    handleAdd(
                                      vehicleBranchByPlateNumberData?.getVehicleByPlateNumber
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
                            {/* )} */}
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
        <AddOrUpdateCertificateModal
          vehicle={createList}
          href={path}
          branchId={branchId}
        />
      ) : null}
    </>
  );
};

export default VehicleByPlateNumber;
