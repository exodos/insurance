import { useContext, useState } from "react";
import { useRouter } from "next/router";
import NotificationContext from "@/store/notification-context";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CreateTariff = gql`
  mutation CreateTariff($input: TariffCreateInput!) {
    createTariff(input: $input) {
      id
      vehicleType
      vehicleSubType
      vehicleDetail
      vehicleUsage
      premiumTarif
      createdAt
      updatedAt
    }
  }
`;

const AddTariffModal = () => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);

  const [createTariff, { data, error, loading }] = useMutation(CreateTariff);
  if (error) {
    console.log(error);
  }

  const initialValues = {
    vehicleType: "",
    vehicleSubType: "",
    vehicleDetail: "",
    vehicleUsage: "",
    premiumTarif: "",
  };
  const validate = Yup.object().shape({
    vehicleType: Yup.string().required("Vehicle Type Is Required"),
    vehicleSubType: Yup.string().required("Vehicle Sub Type Is Required"),
    vehicleDetail: Yup.string().required("Vehicle Detail Is Required"),
    vehicleUsage: Yup.string().required("Vehicle Usage Is Required"),
    premiumTarif: Yup.number().required("Premium Tarif Is Required"),
  });
  const [formValues, setFormValues] = useState(null);

  const router = useRouter();

  const onSubmit = async (values: any) => {
    const input = {
      vehicleType: values.vehicleType,
      vehicleSubType: values.vehicleSubType,
      vehicleDetail: values.vehicleDetail,
      vehicleUsage: values.vehicleUsage,
      premiumTarif: values.premiumTarif,
    };

    // console.log(input);

    await createTariff({
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
          message: "Successfully Created User Data",
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
    }).then(() => router.push("/admin/tariff"));
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
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
                                Create Tariff
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
                              Please enter detail for the tariff
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 mt-4">
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="vehicleType"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Type Of Vehicle
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="vehicleType"
                                placeholder="Enter Type Of Vehicle"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="vehicleType" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="vehicleSubType"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Sub Type Of Vehicle
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="vehicleSubType"
                                placeholder="Enter Sub Type Of Vehicle"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="vehicleSubType" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="vehicleDetail"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Detail Of Vehicle
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="vehicleDetail"
                                placeholder="Enter Detail Of Vehicle"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="vehicleDetail" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
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
                                placeholder="Enter Usage"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="vehicleUsage" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="premiumTarif"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Premium Tarif
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="number"
                                step="any"
                                name="premiumTarif"
                                placeholder="Enter Premium Tarif"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="premiumTarif" />
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

export default AddTariffModal;
