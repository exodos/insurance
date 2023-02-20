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

const CreateHitAndRunPoliceReport = gql`
  mutation Mutation($input: hitAndRunCreateInput!) {
    createHitAndRunPoliceReport(input: $input) {
      id
      incidentNumber
      incidentCause
      incidentDate
      incidentPlace
      incidentTime
      reportDate
      victims {
        id
        victimName
        victimCondition
        injuryType
        victimAddress
        victimFamilyPhoneNumber
        victimHospitalized
        createdAt
        updatedAt
      }
      claimHitAndRuns {
        id
        claimNumber
        damageEstimate
        claimedAt
        claimerFullName
        claimerRegion
        claimerCity
        claimerPhoneNumber
        updatedAt
        branchs {
          id
        }
      }
      branchs {
        id
      }
      policeBranch {
        id
      }
      trafficPolices {
        id
      }
    }
  }
`;

const CreateHitAndRunModal = ({ branchData, branchId, userId, href }) => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);
  const [branchOptions, setBranchOptions] = useState(branchData.branchs);

  const [createHitAndRunPoliceReport, { data, error, loading }] = useMutation(
    CreateHitAndRunPoliceReport
  );
  if (error) {
    console.log(error);
  }

  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;

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

  const victimedGroup = {
    victimName: "",
    victimCondition: "",
    injuryType: "",
    victimAddress: "",
    victimFamilyPhoneNumber: "",
    victimHospitalized: "",
  };

  const initialValues = {
    incidentCause: "",
    incidentDate: "",
    incidentPlace: "",
    incidentTime: "",
    victims: [],
    damageEstimate: "",
    claimerFullName: "",
    claimerRegion: "",
    claimerCity: "",
    claimerPhoneNumber: "",
    branchName: "",
  };

  const validate = Yup.object().shape({
    incidentCause: Yup.string().required("Incident Cause Is Required"),
    incidentDate: Yup.date().required("Incident Date Is Required"),
    incidentPlace: Yup.string().required("Incident Place Is Required"),
    incidentTime: Yup.string().required("Incident Time Is Required"),
    damageEstimate: Yup.number()
      .typeError("You Must Specify A Number")
      .required("Damage Estimate Is Required"),
    claimerFullName: Yup.string().required("Claimant FullName Is Required"),
    claimerRegion: Yup.string().required("Claimant Region Is Required"),
    claimerCity: Yup.string().required("Claimant City Is Required"),
    claimerPhoneNumber: Yup.string()
      .matches(phoneRegExp, "Claimant Phone Number Is Not Valid")
      .required("Claimant Phone Number Is Required"),
    branchName: Yup.string().required("Branch Name Is Required"),
  });
  const [formValues, setFormValues] = useState(null);

  const router = useRouter();

  const onSubmit = async (values: any) => {
    const input = {
      incidentCause: values.incidentCause,
      incidentDate: new Date(values.incidentDate),
      incidentPlace: values.incidentPlace,
      incidentTime: values.incidentTime,
      victims: [...values.victims],
      claimHitAndRuns: {
        damageEstimate: values.damageEstimate,
        claimerFullName: values.claimerFullName,
        claimerRegion: values.claimerRegion,
        claimerCity: values.claimerCity,
        claimerPhoneNumber: changePhone(values.claimerPhoneNumber),
        branchs: {
          id: values.branchName,
        },
      },
      branchs: {
        id: values.branchName,
      },
      policeBranch: {
        id: branchId,
      },
      trafficPolices: {
        id: userId,
      },
    };

    await createHitAndRunPoliceReport({
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-4xl">
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
                                  Add Hit And Run Report
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
                            <div className="space-x-1 grid grid-cols-2 gap-2">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
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
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="incidentCause"
                                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                  >
                                    Incident Cause
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
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
                            </div>
                            <div className="space-x-1 grid grid-cols-3 gap-1">
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="incidentDate"
                                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                  >
                                    Incident Date
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
                                  <Field
                                    type="date"
                                    name="incidentDate"
                                    placeholder="Enter Incident Date"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="incidentDate" />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="incidentPlace"
                                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                  >
                                    Incident Place
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
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
                              <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                <div>
                                  <label
                                    htmlFor="incidentTime"
                                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                  >
                                    Incident Time
                                  </label>
                                </div>
                                <div className="sm:col-span-2">
                                  <Field
                                    type="time"
                                    name="incidentTime"
                                    placeholder="Enter Incident Time"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                                  <div className="text-eRed text-sm italic mt-2">
                                    <ErrorMessage name="incidentTime" />
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
                          <div className="space-x-1 grid grid-cols-3 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="damageEstimate"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Estimated Damage
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="number"
                                  step="any"
                                  name="damageEstimate"
                                  placeholder="Enter Estimated Damage"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="damageEstimate" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="claimerFullName"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Claimant FullName
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="claimerFullName"
                                  placeholder="Enter Claimant Full Name"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="claimerFullName" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="claimerRegion"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Claimant Region
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="claimerRegion"
                                  placeholder="Enter Claimant Region"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="claimerRegion" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-1 grid grid-cols-2 gap-1">
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="claimerCity"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Claimant City
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="claimerCity"
                                  placeholder="Enter Claimant City"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="claimerCity" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4 sm:grid sm:grid-cols-1 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                              <div>
                                <label
                                  htmlFor="claimerPhoneNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Claimant Phone Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="claimerPhoneNumber"
                                  placeholder="Enter Claimant Phone Number"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="claimerPhoneNumber" />
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

export default CreateHitAndRunModal;
