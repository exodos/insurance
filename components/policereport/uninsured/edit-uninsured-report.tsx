import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { changePhone } from "lib/config";
import NotificationContext from "@/store/notification-context";

const UpdateUnInsuredPoliceReport = gql`
  mutation UpdateUnInsuredPoliceReport(
    $updateUnInsuredPoliceReportId: String!
    $input: UnInsuredPoliceReportUpdateInput!
  ) {
    updateUnInsuredPoliceReport(
      id: $updateUnInsuredPoliceReportId
      input: $input
    ) {
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
      incidentCause
      incidentDate
      incidentPlace
      incidentTime
      responsibleDriverName
      responsiblePhoneNumber
    }
  }
`;

const EditUnInsuredPoliceReportModal = ({ policeReport, href }) => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);

  const [updateUnInsuredPoliceReport, { data, error, loading }] = useMutation(
    UpdateUnInsuredPoliceReport
  );
  if (error) {
    console.log(error);
  }

  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;

  const initialValues = {
    victimDriverName: policeReport.victimDriverName,
    victimLicenceNumber: policeReport.victimLicenceNumber,
    victimLevel: policeReport.victimLevel,
    victimRegion: policeReport.victimRegion,
    victimCity: policeReport.victimCity,
    victimSubCity: policeReport.victimSubCity,
    victimWereda: policeReport.victimWereda,
    victimKebelle: policeReport.victimKebelle,
    victimHouseNo: policeReport.victimHouseNo,
    victimPhoneNumber: policeReport.victimPhoneNumber,
    incidentCause: policeReport.incidentCause,
    incidentDate: new Date(policeReport.incidentDate),
    incidentPlace: policeReport.incidentPlace,
    incidentTime: policeReport.incidentTime,
    responsibleDriverName: policeReport.responsibleDriverName,
    responsiblePhoneNumber: policeReport.responsiblePhoneNumber,
  };
  const validate = Yup.object().shape({
    victimDriverName: Yup.string().required("Victim DriverName Is Required"),
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
    victimPhoneNumber: Yup.string()
      .matches(phoneRegExp, "Victim Driver Phone Number Is Not Valid")
      .required("Responsible Driver Phone Number Is Required"),
    incidentCause: Yup.string().required("Incident Cause Is Required"),
    incidentDate: Yup.date().required("Incident Date Is Required"),
    incidentPlace: Yup.string().required("Incident Place Is Required"),
    incidentTime: Yup.string().required("Incident Time Is Required"),
    responsibleDriverName: Yup.string().required(
      "Responsible Driver Name Is Required"
    ),
    responsiblePhoneNumber: Yup.string()
      .matches(phoneRegExp, "Responsible Driver Phone Number Is Not Valid")
      .required("Responsible Driver Phone Number Is Required"),
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
      incidentCause: values.incidentCause,
      incidentDate: new Date(values.incidentDate),
      incidentPlace: values.incidentPlace,
      incidentTime: values.incidentTime,
      responsibleDriverName: values.responsibleDriverName,
      responsiblePhoneNumber: changePhone(values.responsiblePhoneNumber),
    };

    await updateUnInsuredPoliceReport({
      variables: {
        updateUnInsuredPoliceReportId: policeReport.id,
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
          message: "Successfully Updated Police Report Data",
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
                    <Form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="bg-lightGreen px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-lg font-semibold text-white mt-10">
                                Update Police Report For Insured
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
                          <div className="space-x-4 grid grid-cols-3 gap-2">
                            <div className="space-y-1 px-4  grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimDriverName"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimLicenceNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Victim Licence Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimLevel"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Victim Level
                                </label>
                              </div>
                              <div className="sm:col-span-2">
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
                          </div>
                          <div className="space-x-1 grid grid-cols-4 gap-1">
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-4 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimRegion"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-4 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimCity"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Victim City
                                </label>
                              </div>
                              <div className="sm:col-span-2">
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-4 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimSubCity"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Victim SubCity
                                </label>
                              </div>
                              <div className="sm:col-span-2">
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-4 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimWereda"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Victim Wereda
                                </label>
                              </div>
                              <div className="sm:col-span-2">
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
                          </div>
                          <div className="space-x-4 grid grid-cols-3 gap-2">
                            <div className="space-y-1 px-4  grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimKebelle"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Victim Kebele
                                </label>
                              </div>
                              <div className="sm:col-span-1">
                                <Field
                                  type="text"
                                  name="victimKebelle"
                                  placeholder="Enter Victim Kebele"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="victimKebelle" />
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1 px-4  grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimHouseNo"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="victimPhoneNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Victim Phone Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="victimPhoneNumber"
                                  placeholder="Enter Victim Phone Number"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="victimPhoneNumber" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-x-4 grid grid-cols-3 gap-2">
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="incidentCause"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Accident Cause
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="incidentDate"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Accident Date
                                </label>
                              </div>
                              <div className="sm:col-span-2">
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
                            <div className="space-y-1 px-4  grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="incidentPlace"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Accident Place
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
                          <div className="space-x-4 grid grid-cols-3 gap-2">
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="incidentTime"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Accident Time
                                </label>
                              </div>
                              <div className="sm:col-span-2">
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
                            <div className="space-y-1 px-4  grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="responsibleDriverName"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
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
                            <div className="space-y-1 px-4 grid-cols-1  sm:px-6 sm:py-3">
                              <div>
                                <label
                                  htmlFor="responsiblePhoneNumber"
                                  className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                >
                                  Responsible Driver Phone Number
                                </label>
                              </div>
                              <div className="sm:col-span-2">
                                <Field
                                  type="text"
                                  name="responsiblePhoneNumber"
                                  placeholder="Enter Responsible Driver Phone"
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                <div className="text-eRed text-sm italic mt-2">
                                  <ErrorMessage name="responsiblePhoneNumber" />
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

export default EditUnInsuredPoliceReportModal;
