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

const CreateVehicle = gql`
  mutation CreateVehicle($input: VehicleCreateInput!) {
    createVehicle(input: $input) {
      id
      plateNumber
      engineNumber
      chassisNumber
      vehicleType
      carryingCapacityInGoods
      carryingCapacityInPersons
      vehicleStatus
      insureds {
        mobileNumber
      }
      branchs {
        id
      }
    }
  }
`;

const AddVehicleModal = ({ regionCode, codeList, branch, href }) => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);
  const [plateRegionOption, setPlateRegionOption] = useState(regionCode);
  const [plateCodeOption, setPlateCodeOption] = useState(codeList);
  const [branchOptions, setBranchOptions] = useState(branch);

  const [createVehicle, { data, error, loading }] = useMutation(CreateVehicle);
  if (error) {
    console.log(error);
  }
  const vehicleStatusOptions = [
    { value: "NEW", label: "NEW" },
    { value: "RENEWAL", label: "RENEWAL" },
    { value: "ADDITIONAL", label: "ADDITIONAL" },
  ];

  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;
  const plateNumberRegExp = /^([A-Da-d])?\d{5}$/;

  const initialValues = {
    plateCode: "",
    plateRegion: "",
    plateNumber: "",
    engineNumber: "",
    chassisNumber: "",
    vehicleType: "",
    carryingCapacityInGoods: "",
    carryingCapacityInPersons: "",
    vehicleStatus: "",
    mobileNumber: "",
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
    vehicleType: Yup.string().required("Vehicle Type Is Required"),
    carryingCapacityInGoods: Yup.string().required(
      "Carrying Capacity (In Goods) Is Required"
    ),
    carryingCapacityInPersons: Yup.string().required(
      "Carrying Capacity (In Persons) Is Required"
    ),
    vehicleStatus: Yup.string().required("Vehicle Status Is Required"),
    mobileNumber: Yup.string()
      .matches(phoneRegExp, "Phone Number Is Not Valid")
      .required("Phone Number Is Required"),
    branchName: Yup.string().required("Branch Name Is Required"),
  });
  const [formValues, setFormValues] = useState(null);

  const router = useRouter();

  const onSubmit = async (values: any) => {
    const input = {
      plateNumber: `${values.plateCode}${values.plateRegion}${values.plateNumber}`,
      engineNumber: values.engineNumber,
      chassisNumber: values.chassisNumber,
      vehicleType: values.vehicleType,
      carryingCapacityInGoods: values.carryingCapacityInGoods,
      carryingCapacityInPersons: values.carryingCapacityInPersons,
      vehicleStatus: values.vehicleStatus,
      insureds: {
        mobileNumber: changePhone(values.mobileNumber),
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-3xl">
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
                        </div>
                        <div className="space-y-4 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 mt-8">
                          <div className="space-x-1 grid grid-cols-2 gap-1">
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
                          </div>
                          <div className="space-x-1 grid grid-cols-2 gap-1">
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
                          </div>

                          <div className="space-x-1 grid grid-cols-2 gap-1">
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
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="carryingCapacityInGoods"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Carrying Capacity (In Goods)
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="carryingCapacityInGoods"
                                placeholder="Enter Vehicle Carrying Capacity In Goods"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="carryingCapacityInGoods" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="carryingCapacityInPersons"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Carrying Capacity (In Persons)
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="carryingCapacityInPersons"
                                placeholder="Enter Vehicle Carrying Capacity In Persons"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="carryingCapacityInPersons" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
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
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="mobileNumber"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Insured Mobile Number
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="mobileNumber"
                                placeholder="Enter Insured Mobile Number"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="mobileNumber" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="branchName"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Branch Name
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
