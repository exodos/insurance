import { useContext, useState } from "react";
import { useRouter } from "next/router";
import NotificationContext from "@/store/notification-context";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { changePhone } from "lib/config";

const UpdateVehicle = gql`
  mutation UpdateVehicle(
    $updateVehicleId: String!
    $input: vehicleUpdateInput!
  ) {
    updateVehicle(id: $updateVehicleId, input: $input) {
      id
      plateNumber
      vehicleModel
      bodyType
      horsePower
      manufacturedYear
      vehicleType
      vehicleSubType
      vehicleDetails
      vehicleUsage
      passengerNumber
      carryingCapacityInGoods
      purchasedYear
      dutyFreeValue
      dutyPaidValue
      vehicleStatus
    }
  }
`;

const EditVehicleModal = ({
  vehicle,
  regionCode,
  codeList,
  href,
  branchData,
}) => {
  const notificationCtx = useContext(NotificationContext);
  const [plateRegionOption, setPlateRegionOption] = useState(regionCode);
  const [plateCodeOption, setPlateCodeOption] = useState(codeList);
  const [open, setOpen] = useState<boolean>(true);
  const [formValues, setFormValues] = useState(null);
  const [branchOptions, setBranchOptions] = useState(branchData);

  console.log(branchData);

  const [updateVehicle] = useMutation(UpdateVehicle);

  const router = useRouter();
  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;
  const plateNumberRegExp = /^([A-Da-d])?\d{5}$/;

  const initialValues = {
    plateCode: vehicle.plateNumber.slice(0, 1),
    plateRegion: vehicle.plateNumber.slice(1, 3),
    plateNumber: vehicle.plateNumber.slice(3),
    vehicleModel: vehicle.vehicleModel,
    bodyType: vehicle.bodyType,
    horsePower: vehicle.horsePower,
    manufacturedYear: vehicle.manufacturedYear,
    vehicleType: vehicle.vehicleType,
    vehicleSubType: vehicle.vehicleSubType,
    vehicleDetails: vehicle.vehicleDetails,
    vehicleUsage: vehicle.vehicleUsage,
    passengerNumber: vehicle.passengerNumber,
    carryingCapacityInGoods: vehicle.carryingCapacityInGoods,
    purchasedYear: vehicle.purchasedYear,
    dutyFreeValue: vehicle.dutyFreeValue,
    dutyPaidValue: vehicle.dutyPaidValue,
    vehicleStatus: vehicle.vehicleStatus,
    // mobileNumber: vehicle.insureds.mobileNumber,
    // branchName: vehicle.branchs.branchName,
  };

  const validate = Yup.object().shape({
    plateCode: Yup.string().required("Plate Code Is Required"),
    plateRegion: Yup.string().required("Plate Region Is Required"),
    plateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Plate Number Is Required"),
    vehicleModel: Yup.string().required("Vehicle Model Is Required"),
    bodyType: Yup.string().required("Body Type Is Required"),
    horsePower: Yup.string().required("Horse Power Is Required"),
    manufacturedYear: Yup.number().required(
      "Manufactured Year In Goods Is Required"
    ),
    vehicleType: Yup.string().required("Vehicle Type Is Required"),
    vehicleSubType: Yup.string().required("Vehicle Sub Type Is Required"),
    vehicleDetails: Yup.string().required("Vehicle Detail Is Required"),
    vehicleUsage: Yup.string().required("Usage Is Required"),
    passengerNumber: Yup.string().required("Passenger Number Is Required"),
    purchasedYear: Yup.number().required("Purchased Year Is Required"),
    dutyFreeValue: Yup.number().required("Duty Free Value Is Required"),
    dutyPaidValue: Yup.string().required("Duty Paid Value Is Required"),
    vehicleStatus: Yup.string().required("Vehicle Status Is Required"),
    // mobileNumber: Yup.string()
    //   .matches(phoneRegExp, "Phone Number Is Not Valid")
    //   .required("Insured Phone Number Is Required"),
    // branchName: Yup.string().required("Branch Name Is Required"),
  });

  const vehicleStatusOptions = [
    { value: "NEW", label: "NEW" },
    { value: "RENEWAL", label: "RENEWAL" },
    { value: "ADDITIONAL", label: "ADDITIONAL" },
  ];

  const onSubmit = async (values: any) => {
    const input = {
      plateNumber: `${values.plateCode}${values.plateRegion}${values.plateNumber}`,
      vehicleModel: values.vehicleModel,
      bodyType: values.bodyType,
      horsePower: values.horsePower,
      manufacturedYear: values.manufacturedYear,
      vehicleType: values.vehicleType,
      vehicleSubType: values.vehicleSubType,
      vehicleDetails: values.vehicleDetails,
      vehicleUsage: values.vehicleUsage,
      passengerNumber: values.passengerNumber,
      carryingCapacityInGoods: values.carryingCapacityInGoods,
      purchasedYear: values.purchasedYear,
      dutyFreeValue: values.dutyFreeValue,
      dutyPaidValue: values.dutyPaidValue,
      vehicleStatus: values.vehicleStatus,

      // insureds: {
      //   mobileNumber: changePhone(values.mobileNumber),
      // },
      // branchs: {
      //   id: values.branchName,
      // },
    };

    // console.log(input);

    await updateVehicle({
      variables: {
        updateVehicleId: vehicle.id,
        input,
      },
      onError: (error) => {
        setOpen(false);
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      },
      onCompleted: (data) => {
        setOpen(false);
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully Updated Insured Data",
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

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-5xl">
                  <Formik
                    initialValues={formValues || initialValues}
                    validationSchema={validate}
                    onSubmit={onSubmit}
                    enableReinitialize={true}
                  >
                    <Form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-lightGreen px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-lg font-semibold text-white mt-10">
                                Update Vehicle
                              </Dialog.Title>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="text-gray-50 hover:text-gray-800"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 mt-8">
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="plateCode"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Plate Code
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  as="select"
                                  name="plateCode"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  {plateCodeOption.map((option: any) => (
                                    <option
                                      key={option.code}
                                      value={option.code}
                                    >
                                      {option.code}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="plateCode" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="plateRegion"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Plate Region
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  as="select"
                                  name="plateRegion"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  {plateRegionOption.map((option: any) => (
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
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="plateNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Plate Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="plateNumber"
                                  placeholder="Enter Vehicle Plate Number"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="plateNumber" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-3">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="vehicleModel"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Vehicle Model
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="vehicleModel"
                                  placeholder="Enter Vehicle Model"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleModel" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="bodyType"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Body Type
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="bodyType"
                                  placeholder="Enter Vehicle Body Type"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="bodyType" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="horsePower"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Horse Power
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="horsePower"
                                  placeholder="Enter Vehicle Horse Power"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="horsePower" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="manufacturedYear"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Manufactured Year
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="number"
                                  name="manufacturedYear"
                                  placeholder="Enter Vehicle Manufactured Year"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="manufacturedYear" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="vehicleType"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Vehicle Type
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="vehicleType"
                                  placeholder="Enter Vehicle Type"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleType" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="vehicleSubType"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Vehicle Sub Type
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="vehicleSubType"
                                  placeholder="Enter Vehicle Sub Type"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleSubType" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="vehicleDetails"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Vehicle Detail
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="vehicleDetails"
                                  placeholder="Enter Vehicle Detail"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleDetails" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="vehicleUsage"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Usage
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="vehicleUsage"
                                  placeholder="Enter Vehicle Usage"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleUsage" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="passengerNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Passenger Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="passengerNumber"
                                  placeholder="Enter Number Of Passenger"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="passengerNumber" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="carryingCapacityInGoods"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Goods Carrying Capacity
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="carryingCapacityInGoods"
                                  placeholder="Enter Goods Carrying Capacity"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="carryingCapacityInGoods" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="purchasedYear"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Purchased Year
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="number"
                                  name="purchasedYear"
                                  placeholder="Enter Purchased Year"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="purchasedYear" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="dutyFreeValue"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Duty Free Value
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="number"
                                  step="any"
                                  name="dutyFreeValue"
                                  placeholder="Enter Duty Free Value"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="dutyFreeValue" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-2 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="dutyPaidValue"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Duty Paid Value
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="number"
                                  name="dutyPaidValue"
                                  placeholder="Enter Duty Paid Value"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="dutyPaidValue" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="vehicleStatus"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Vehicle Status
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  as="select"
                                  name="vehicleStatus"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  {vehicleStatusOptions.map((option: any) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleStatus" />
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="space-x-1 grid grid-cols-2 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="mobileNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Insurer Mobile Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="mobileNumber"
                                  placeholder="Enter Insurer Mobile Number"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="mobileNumber" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-1 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="branchName"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Branch
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  as="select"
                                  name="branchName"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  {branchOptions.map((option: any) => (
                                    <option key={option.id} value={option.uid}>
                                      {option.branchName}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="branchName" />
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-lightGreen py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-depGreen focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditVehicleModal;
