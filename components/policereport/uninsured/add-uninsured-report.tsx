import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import "react-datetime/css/react-datetime.css";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import NotificationContext from "@/store/notification-context";
import { changePhone } from "lib/config";

const CreateUnInsuredPoliceReport = gql`
  mutation CreateUnInsuredPoliceReport(
    $input: UnInsuredPoliceReportCreateInput!
  ) {
    createUnInsuredPoliceReport(input: $input) {
      id
      incidentNumber
      victimDriverName
      victimLicenceNumber
      victimLevel
      victimRegion
      victimCity
      victimSubCity
      victimWereda
      victimKebelle
      victimHouseNo
      victimPhoneNumber
      victimVehiclePlateNumber
      incidentCause
      incidentDate
      incidentPlace
      incidentTime
      responsibleDriverName
      responsiblePhoneNumber
      responsibleVehiclePlateNumber
      reportDate
      victims {
        victimName
        victimCondition
        injuryType
        victimAddress
        victimFamilyPhoneNumber
        victimHospitalized
      }
      branchs {
        id
      }
      policeBranch {
        id
      }
      claimUnInsureds {
        id
        claimNumber
        damageEstimate
        vehiclePlateNumber
        claimedAt
        updatedAt
      }
      trafficPolices {
        id
      }
    }
  }
`;

const CreateUnInsuredReportModal = ({
  regionCode,
  codeList,
  branchData,
  userId,
  branchId,
  href,
}) => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);
  const [plateRegionOption, setPlateRegionOption] = useState(regionCode);
  const [plateCodeOption, setPlateCodeOption] = useState(codeList);
  const [branchOptions, setBranchOptions] = useState(branchData.branchs);

  const [createUnInsuredPoliceReport, { data, error, loading }] = useMutation(
    CreateUnInsuredPoliceReport
  );
  if (error) {
    console.log(error);
  }

  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;
  const plateNumberRegExp = /^([A-Da-d])?\d{5}$/;

  const victimConditionOptions = [
    { value: "PASSENGER", label: "PASSENGER" },
    { value: "PEDESTRIAN", label: "PEDESTRIAN" },
    { value: "DRIVER", label: "DRIVER" },
    { value: "ASSISTANT", label: "ASSISTANT" },
  ];

  const injuryTypeOptions = [
    { value: "SIMPLE", label: "SIMPLE" },
    { value: "CRITICAL", label: "CRITICAL" },
    { value: "DEATH", label: "DEATH" },
  ];

  const initialValues = {
    victimDriverName: "",
    victimLicenceNumber: "",
    victimLevel: "",
    victimRegion: "",
    victimCity: "",
    victimSubCity: "",
    victimWereda: "",
    victimKebelle: "",
    victimHouseNo: "",
    victimPhoneNumber: "",
    victimPlateCode: "",
    victimPlateRegion: "",
    victimVehiclePlateNumber: "",
    responsibleVehiclePlateNumber: "",
    responsibleDriverName: "",
    responsiblePlateCode: "",
    responsiblePlateRegion: "",
    responsiblePhoneNumber: "",
    incidentCause: "",
    incidentDate: "",
    incidentPlace: "",
    incidentTime: "",
    victims: [],
    damageEstimate: "",
    branchName: "",
  };

  const validate = Yup.object().shape({
    victimDriverName: Yup.string().required("Victim Driver Name Is Required"),
    victimLicenceNumber: Yup.string().required(
      "Victim Licence Number Is Required"
    ),
    victimLevel: Yup.string().required("Victim Level Is Required"),
    victimRegion: Yup.string().required("Victim Region Is Required"),
    victimCity: Yup.string().required("Victim City Is Required"),
    victimSubCity: Yup.string().required("Victim SubCity Is Required"),
    victimWereda: Yup.string().required("Victim Wereda Is Required"),
    victimKebelle: Yup.string().required("Victim Kebelle Is Required"),
    victimHouseNo: Yup.string().required("Victim HouseNo Is Required"),
    victimPlateCode: Yup.string().required("Plate Code Is Required"),
    victimPlateRegion: Yup.string().required("Plate Region Is Required"),
    victimPhoneNumber: Yup.string()
      .matches(phoneRegExp, "Traffic Police Phone Number Is Not Valid")
      .required("Victim PhoneNumber Is Required"),
    victimVehiclePlateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Victim Vehicle PlateNumber Is Required"),
    incidentCause: Yup.string().required("Incident Cause Is Required"),
    incidentDate: Yup.date().required("Incident Date Is Required"),
    incidentPlace: Yup.string().required("Incident Place Is Required"),
    incidentTime: Yup.string().required("Incident Time Is Required"),
    responsibleDriverName: Yup.string().required(
      "Responsible Driver Name Is Required"
    ),
    responsiblePhoneNumber: Yup.string()
      .matches(phoneRegExp, "Phone Number Is Not Valid")
      .required("Responsible Driver PhoneNumber Is Required"),
    responsiblePlateCode: Yup.string().required("Plate Code Is Required"),
    responsiblePlateRegion: Yup.string().required("Plate Region Is Required"),
    responsibleVehiclePlateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Responsible Vehicle PlateNumber Is Required"),
    damageEstimate: Yup.number()
      .typeError("You Must Specify A Number")
      .required("Damage Estimate Is Required"),
    branchName: Yup.string().required("Branch Name Is Required"),
  });
  const [formValues, setFormValues] = useState(null);

  const router = useRouter();

  const onSubmit = async (values: any) => {
    const input = {
      victimDriverName: values.victimDriverName,
      victimLicenceNumber: values.victimLicenceNumber,
      victimLevel: values.victimLevel,
      victimRegion: values.victimRegion,
      victimCity: values.victimCity,
      victimSubCity: values.victimSubCity,
      victimWereda: values.victimWereda,
      victimKebelle: values.victimKebelle,
      victimHouseNo: values.victimHouseNo,
      victimPhoneNumber: changePhone(values.victimPhoneNumber),
      victimVehiclePlateNumber: `${values.victimPlateCode}${values.victimPlateRegion}${values.victimVehiclePlateNumber}`,
      responsibleVehiclePlateNumber: `${values.responsiblePlateCode}${values.responsiblePlateRegion}${values.responsibleVehiclePlateNumber}`,
      responsibleDriverName: values.responsibleDriverName,
      responsiblePhoneNumber: changePhone(values.responsiblePhoneNumber),
      incidentCause: values.incidentCause,
      incidentDate: new Date(values.incidentDate),
      incidentPlace: values.incidentPlace,
      incidentTime: values.incidentTime,
      victims: [...values.victims],
      branchs: {
        id: values.branchName,
      },
      claimUnInsureds: {
        damageEstimate: values.damageEstimate,
        vehiclePlateNumber: `${values.victimPlateCode}${values.victimPlateRegion}${values.victimVehiclePlateNumber}`,
        branchs: {
          id: values.branchName,
        },
      },
      policeBranch: {
        id: branchId,
      },
      trafficPolices: {
        id: userId,
      },
    };

    // console.log(input);

    await createUnInsuredPoliceReport({
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
          message: "Successfully Created Insured Data",
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-6xl">
                  <Formik
                    initialValues={formValues || initialValues}
                    validationSchema={validate}
                    onSubmit={onSubmit}
                    enableReinitialize={true}
                  >
                    {({ values, setFieldValue }) => (
                      <Form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1">
                          {/* Header */}
                          <div className="bg-lightGreen px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between space-x-3">
                              <div className="space-y-1">
                                <Dialog.Title className="text-lg font-semibold text-white mt-10">
                                  Add UnInsured Vehicle Police Report
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
                          <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 mt-8">
                            <div className="space-x-1 grid grid-cols-4 gap-4">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimDriverName"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Driver Name
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimDriverName"
                                    placeholder="Enter Victim Driver Name"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimDriverName" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimLicenceNumber"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Licence Number
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimLicenceNumber"
                                    placeholder="Enter Victim Licence Number"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimLicenceNumber" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimLevel"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Level
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimLevel"
                                    placeholder="Enter Victim Level"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimLevel" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimRegion"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Region
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimRegion"
                                    placeholder="Enter Victim Region"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimRegion" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-x-1 grid grid-cols-4 gap-4 pt-4">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimCity"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim City
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimCity"
                                    placeholder="Enter Victim City"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimCity" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimSubCity"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim SubCity
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimSubCity"
                                    placeholder="Enter Victim SubCity"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimSubCity" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimWereda"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Wereda
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimWereda"
                                    placeholder="Enter Victim Wereda"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimWereda" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimKebelle"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Kebelle
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimKebelle"
                                    placeholder="Enter Victim Kebelle"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimKebelle" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-x-1 grid grid-cols-4 gap-4 pt-4">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimHouseNo"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim HouseNo
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimHouseNo"
                                    placeholder="Enter Victim HouseNo"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimHouseNo" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimPhoneNumber"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Driver Phone Number
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimPhoneNumber"
                                    placeholder="Enter Victim PhoneNumber"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimPhoneNumber" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimPlateCode"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Plate Code
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    as="select"
                                    name="victimPlateCode"
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
                                    <ErrorMessage name="victimPlateCode" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimPlateRegion"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Plate Region
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    as="select"
                                    name="victimPlateRegion"
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
                                    <ErrorMessage name="victimPlateRegion" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-x-1 grid grid-cols-4 gap-4 pt-4">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="victimVehiclePlateNumber"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Victim Vehicle Plate Number
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="victimVehiclePlateNumber"
                                    placeholder="Enter Victim Vehicle PlateNumber"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="victimVehiclePlateNumber" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="incidentCause"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Incident Cause
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="incidentCause"
                                    placeholder="Enter Incident Cause"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="incidentCause" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="incidentDate"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Incident Date
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="date"
                                    name="incidentDate"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="incidentDate" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="incidentPlace"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Incident Place
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="incidentPlace"
                                    placeholder="Enter Incident Place"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="incidentPlace" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-x-1 grid grid-cols-4 gap-5 pt-4">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="incidentTime"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Incident Time
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="time"
                                    name="incidentTime"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="incidentTime" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="responsibleDriverName"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Responsible Driver Name
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="responsibleDriverName"
                                    placeholder="Enter Responsible Driver Name"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="responsibleDriverName" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="responsiblePhoneNumber"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Responsible Driver Phone Number
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="responsiblePhoneNumber"
                                    placeholder="Enter Responsible Phone Number"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="responsiblePhoneNumber" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="responsiblePlateCode"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Responsible Vehicle PlateCode
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    as="select"
                                    name="responsiblePlateCode"
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
                                    <ErrorMessage name="responsiblePlateCode" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-x-1 grid grid-cols-4 gap-4 pt-4">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="responsiblePlateRegion"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Responsible PlateRegion
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    as="select"
                                    name="responsiblePlateRegion"
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
                                    <ErrorMessage name="responsiblePlateRegion" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="responsibleVehiclePlateNumber"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Responsible Vehicle PlateNumber
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="text"
                                    name="responsibleVehiclePlateNumber"
                                    placeholder="Enter Responsible Vehicle PlateNumber"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="responsibleVehiclePlateNumber" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="damageEstimate"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Damage Estimate
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    type="number"
                                    step="any"
                                    name="damageEstimate"
                                    placeholder="Enter Damage Estimate"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="damageEstimate" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-1">
                                <div>
                                  <label
                                    htmlFor="branchName"
                                    className="block text-sm font-medium text-gray-900"
                                  >
                                    Branch Name
                                  </label>
                                </div>
                                <div className="sm:col-span-1">
                                  <Field
                                    as="select"
                                    name="branchName"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  >
                                    <option disabled value="">
                                      Select Branch
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
                            <FieldArray
                              name="victims"
                              render={(arrayHelpers) => (
                                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                                  <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="mt-5 md:mt-0 md:col-span-3">
                                      {values.victims &&
                                      values.victims.length > 0 ? (
                                        values.victims.map((_, index: any) => (
                                          <div key={index}>
                                            <div
                                              className="grid grid-cols-3 gap-3"
                                              key={index}
                                            >
                                              <div className="col-span-3 sm:col-span-1">
                                                <label
                                                  htmlFor={`victims.${index}.victimName`}
                                                  className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                  Victim Name
                                                </label>
                                                <Field
                                                  name={`victims.${index}.victimName`}
                                                  placeholder="Enter Victim Name"
                                                  className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                              </div>
                                              <div className="col-span-3 sm:col-span-1">
                                                <label
                                                  htmlFor={`victims.${index}.victimCondition`}
                                                  className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                  Victimed Condition
                                                </label>
                                                <Field
                                                  name={`victims.${index}.victimCondition`}
                                                  as="select"
                                                  className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                  <option disabled value="">
                                                    Select Victim Condition
                                                  </option>
                                                  {victimConditionOptions.map(
                                                    (option: any) => (
                                                      <option
                                                        key={option.value}
                                                        value={option.value}
                                                      >
                                                        {option.label}
                                                      </option>
                                                    )
                                                  )}
                                                </Field>
                                              </div>
                                              <div className="col-span-3 sm:col-span-1">
                                                <label
                                                  htmlFor={`victims.${index}.injuryType`}
                                                  className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                  Injury Type
                                                </label>
                                                <Field
                                                  name={`victims.${index}.injuryType`}
                                                  as="select"
                                                  className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                  <option disabled value="">
                                                    Select Injury Type
                                                  </option>
                                                  {injuryTypeOptions.map(
                                                    (option: any) => (
                                                      <option
                                                        key={option.value}
                                                        value={option.value}
                                                      >
                                                        {option.label}
                                                      </option>
                                                    )
                                                  )}
                                                </Field>
                                              </div>
                                              <div className="col-span-3 sm:col-span-1">
                                                <label
                                                  htmlFor={`victims.${index}.victimAddress`}
                                                  className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                  Victimed Address
                                                </label>
                                                <Field
                                                  name={`victims.${index}.victimAddress`}
                                                  placeholder="Enter Victimed Address"
                                                  className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                              </div>
                                              <div className="col-span-3 sm:col-span-1">
                                                <label
                                                  htmlFor={`victims.${index}.victimFamilyPhoneNumber`}
                                                  className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                  Victimed FamilyPhoneNumber
                                                </label>
                                                <Field
                                                  name={`victims.${index}.victimFamilyPhoneNumber`}
                                                  placeholder="Enter Family Phone Number"
                                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                              </div>
                                              <div className="col-span-3 sm:col-span-1">
                                                <label
                                                  htmlFor={`victims.${index}.victimHospitalized`}
                                                  className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                  Victimed Hospitalize
                                                </label>
                                                <Field
                                                  name={`victims.${index}.victimHospitalized`}
                                                  placeholder="Enter Victimed Hospitalize"
                                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                              </div>
                                            </div>
                                            <div className="pt-5">
                                              <div className="flex justify-center">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpers.remove(index)
                                                  } // remove a friend from the list
                                                  className="py-2 px-4 bordertext-sm font-medium"
                                                >
                                                  <AiFillMinusCircle
                                                    className="flex-shrink-0 h-8 w-8 text-sm font-medium text-lightGreen hover:text-deepBlue"
                                                    aria-hidden="true"
                                                  />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpers.insert(
                                                      index,
                                                      ""
                                                    )
                                                  }
                                                  className="py-2 px-4 bordertext-sm font-medium"
                                                >
                                                  <AiFillPlusCircle
                                                    className="flex-shrink-0 h-8 w-8 text-sm font-medium text-lightGreen hover:text-deepBlue"
                                                    aria-hidden="true"
                                                  />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => arrayHelpers.push("")}
                                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lightGreen hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                          {/* show this when user has removed all friends from the list */}
                                          Add a Victimed
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            />
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
                    )}
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

export default CreateUnInsuredReportModal;
