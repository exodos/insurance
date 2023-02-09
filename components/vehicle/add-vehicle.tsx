import { useContext, useState } from "react";
import { useRouter } from "next/router";
import NotificationContext from "@/store/notification-context";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CreateVehicle = gql`
  mutation CreateVehicle($input: vehicleCreateInput!) {
    createVehicle(input: $input) {
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
      status
      isInsured
      createdAt
      updatedAt
      insureds {
        id
      }
      branchs {
        id
      }
    }
  }
`;

const AddVehicleModal = ({
  regionCode,
  codeList,
  branch,
  href,
  uniqueTariff,
  insuredId,
}) => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);
  const [plateRegionOption, setPlateRegionOption] = useState(regionCode);
  const [plateCodeOption, setPlateCodeOption] = useState(codeList);
  const [branchOptions, setBranchOptions] = useState(branch);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState(
    uniqueTariff.tariffVehicleType
  );
  const [vehicleSubTypeOptions, setVehicleSubTypeOptions] = useState(
    uniqueTariff.tariffVehicleSubType
  );
  const [vehicleDetailOptions, setVehicleDetailOptions] = useState(
    uniqueTariff.tariffVehicleDetail
  );
  const [vehicleUsageOptions, setVehicleUsageOptions] = useState(
    uniqueTariff.tariffVehicleUsage
  );
  const [vehicleCategoryOptions, setVehicleCategoryOptions] = useState(
    uniqueTariff.tariffVehicleCategory
  );

  console.log(href);

  const [createVehicle, { data, error, loading }] = useMutation(CreateVehicle);
  if (error) {
    console.log(error);
  }
  const vehicleStatusOptions = [
    { value: "NEW", label: "NEW" },
    { value: "RENEWAL", label: "RENEWAL" },
    { value: "ADDITIONAL", label: "ADDITIONAL" },
  ];

  const plateNumberRegExp = /^([A-Da-d])?\d{5}$/;

  const initialValues = {
    plateCode: "",
    plateRegion: "",
    plateNumber: "",
    engineNumber: "",
    chassisNumber: "",
    vehicleModel: "",
    bodyType: "",
    horsePower: "",
    manufacturedYear: "",
    vehicleType: "",
    vehicleSubType: "",
    vehicleDetails: "",
    vehicleUsage: "",
    vehicleCategory: "",
    passengerNumber: "",
    carryingCapacityInGoods: "",
    purchasedYear: "",
    dutyFreeValue: "",
    dutyPaidValue: "",
    vehicleStatus: "",
    // mobileNumber: "",
    branchName: "",
  };
  const validate = Yup.object().shape({
    plateCode: Yup.string().required("Plate Code Is Required"),
    plateRegion: Yup.string().required("Plate Region Is Required"),
    plateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Plate Number Is Required"),
    engineNumber: Yup.string().required("Engine Number Is Required"),
    chassisNumber: Yup.string().required("Chassis Number Is Required"),
    vehicleModel: Yup.string().required("Vehicle Model Is Required"),
    bodyType: Yup.string().required("Body Type Is Required"),
    horsePower: Yup.string().required("Horse Power Is Required"),
    manufacturedYear: Yup.number().required("Manufactured Year Is Required"),
    vehicleType: Yup.string().required("Vehicle Type Is Required"),
    vehicleSubType: Yup.string().required("Vehicle Sub Type Is Required"),
    vehicleDetails: Yup.string().required("Vehicle Detail Is Required"),
    vehicleUsage: Yup.string().required("Vehicle Usage Is Required"),
    vehicleCategory: Yup.string().required("Vehicle Category Is Required"),
    passengerNumber: Yup.number().required("Passenger Number Is Required"),
    // carryingCapacityInGoods: Yup.string().required(
    //   "Carrying Capacity (In Goods) Is Required"
    // ),
    purchasedYear: Yup.number().required("Purchased Year Is Required"),
    dutyFreeValue: Yup.number().required("Duty Free Value Is Required"),
    dutyPaidValue: Yup.number().required("Duty Paid Value Is Required"),
    vehicleStatus: Yup.string().required("Vehicle Status Is Required"),

    // mobileNumber: Yup.string()
    //   .matches(phoneRegExp, "Phone Number Is Not Valid")
    //   .required("Phone Number Is Required"),
    branchName: Yup.string().required("Branch Name Is Required"),
  });
  const [formValues, setFormValues] = useState(null);

  const router = useRouter();

  const onSubmit = async (values: any) => {
    const input = {
      plateNumber: `${values.plateCode}${values.plateRegion}${values.plateNumber}`,
      engineNumber: values.engineNumber,
      chassisNumber: values.chassisNumber,
      vehicleModel: values.vehicleModel,
      bodyType: values.bodyType,
      horsePower: values.horsePower,
      manufacturedYear: values.manufacturedYear,
      vehicleType: values.vehicleType,
      vehicleSubType: values.vehicleSubType,
      vehicleDetails: values.vehicleDetails,
      vehicleUsage: values.vehicleUsage,
      vehicleCategory: values.vehicleCategory,
      passengerNumber: values.passengerNumber,
      carryingCapacityInGoods: values.carryingCapacityInGoods,
      purchasedYear: values.purchasedYear,
      dutyFreeValue: values.dutyFreeValue,
      dutyPaidValue: values.dutyPaidValue,
      vehicleStatus: values.vehicleStatus,
      insureds: {
        id: insuredId,
      },
      branchs: {
        id: values.branchName,
      },
    };

    await createVehicle({
      variables: {
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
          message: "Successfully Created Vehicle Data",
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
                                Add Vehicle
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
                          <div className="mt-1">
                            <p className="text-sm text-white">
                              Please enter detail for the vehicle
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 mt-8">
                          <div className="space-x-1 grid grid-cols-3 gap-3">
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
                                  <option disabled value="">
                                    Select Plate Code
                                  </option>
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
                                  <option disabled value="">
                                    Select Plate Region
                                  </option>
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
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="engineNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Engine Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="engineNumber"
                                  placeholder="Enter Vehicle Engine Number"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="engineNumber" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="chassisNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Chassis Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="chassisNumber"
                                  placeholder="Enter Vehicle Chassis Number"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="chassisNumber" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  as="select"
                                  name="vehicleType"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  <option disabled value="">
                                    Select Vehicle Type
                                  </option>
                                  {vehicleTypeOptions.map((option: any) => (
                                    <option
                                      key={option.vehicleType}
                                      value={option.vehicleType}
                                    >
                                      {option.vehicleType}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleType" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  as="select"
                                  name="vehicleSubType"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  <option disabled value="">
                                    Select Vehicle Sub Type
                                  </option>
                                  {vehicleSubTypeOptions.map((option: any) => (
                                    <option
                                      key={option.vehicleSubType}
                                      value={option.vehicleSubType}
                                    >
                                      {option.vehicleSubType}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleSubType" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  as="select"
                                  name="vehicleDetails"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  <option disabled value="">
                                    Select Vehicle Details
                                  </option>
                                  {vehicleDetailOptions.map((option: any) => (
                                    <option
                                      key={option.vehicleDetail}
                                      value={option.vehicleDetail}
                                    >
                                      {option.vehicleDetail}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleDetails" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  as="select"
                                  name="vehicleUsage"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  <option disabled value="">
                                    Select Usage
                                  </option>
                                  {vehicleUsageOptions.map((option: any) => (
                                    <option
                                      key={option.vehicleUsage}
                                      value={option.vehicleUsage}
                                    >
                                      {option.vehicleUsage}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleUsage" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="vehicleCategory"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Vehicle Category
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  as="select"
                                  name="vehicleCategory"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  <option disabled value="">
                                    Select Usage
                                  </option>
                                  {vehicleCategoryOptions.map((option: any) => (
                                    <option
                                      key={option.vehicleCategory}
                                      value={option.vehicleCategory}
                                    >
                                      {option.vehicleCategory}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="vehicleCategory" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  type="number"
                                  name="passengerNumber"
                                  placeholder="Enter Passenger Number"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="passengerNumber" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
                              <div>
                                <label
                                  htmlFor="carryingCapacityInGoods"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Carrying Capacity In Goods
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="carryingCapacityInGoods"
                                  placeholder="Enter Carrying Capacity"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="carryingCapacityInGoods" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  step="any"
                                  name="dutyPaidValue"
                                  placeholder="Enter Duty Paid Value"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="dutyPaidValue" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  <option disabled value="">
                                    Select Vehicle Status
                                  </option>
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
                            <div className="space-y-1 px-3 sm:grid sm:grid-cols-3 sm:gap-2 sm:space-y-0 sm:px-3 sm:py-5">
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
                                  <option disabled value="">
                                    Select Branch Name
                                  </option>
                                  {branchOptions.map((option: any) => (
                                    <option key={option.id} value={option.id}>
                                      {option.branchName}
                                    </option>
                                  ))}
                                </Field>
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="branchName" />
                                </div>
                              </div>
                            </div>
                          </div>
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
                            Create
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

export default AddVehicleModal;
