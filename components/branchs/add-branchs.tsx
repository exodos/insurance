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

const CreateBranch = gql`
  mutation CreateBranch($input: branchCreateInput!) {
    createBranch(input: $input) {
      id
      branchName
      region
      city
      mobileNumber
      createdAt
      updatedAt
    }
  }
`;

const AdminAddBranch = ({ orgData }) => {
  const notificationCtx = useContext(NotificationContext);
  const [open, setOpen] = useState<boolean>(true);
  const [organizationOptions, setOrganizationOption] = useState(orgData);

  console.log(orgData);

  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;

  const [createBranch, { data, error, loading }] = useMutation(CreateBranch);
  if (error) {
    console.log(error);
  }

  const initialValues = {
    branchName: "",
    branchCode: "",
    region: "",
    city: "",
    mobileNumber: "",
    orgName: "",
  };

  const validate = Yup.object().shape({
    branchName: Yup.string().required("Branch Name Is Required"),
    mobileNumber: Yup.string()
      .matches(phoneRegExp, "Mobile Number Is Not Valid")
      .required("Mobile Number Is Required"),
    orgName: Yup.string().required("Insurer Name Is Required"),
  });
  const [formValues, setFormValues] = useState(null);

  const router = useRouter();

  const onSubmit = async (values: any) => {
    const input = {
      branchName: values.branchName,
      branchCode: values.branchCode,
      region: values.region,
      city: values.city,
      mobileNumber: changePhone(values.mobileNumber),
      organizations: {
        id: values.orgName,
      },
    };
    // console.log(input);

    await createBranch({
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
          message: "Successfully Created Branch Data",
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
    }).then(() => router.push("/admin/branchs"));
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
                                Create Branch
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
                              Please enter detail for the branch
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0 mt-4">
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
                                type="text"
                                name="branchName"
                                placeholder="Enter Branch Name"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="branchName" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="branchCode"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Branch Code
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="branchCode"
                                placeholder="Enter Branch Code"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="region"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Region
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="region"
                                placeholder="Enter Region"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="city"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                City
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="city"
                                placeholder="Enter City"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-3">
                            <div>
                              <label
                                htmlFor="mobileNumber"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Mobile Number
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                type="text"
                                name="mobileNumber"
                                placeholder="Enter Mobile Number"
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
                                htmlFor="orgName"
                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                              >
                                Insurer
                              </label>
                            </div>
                            <div className="sm:col-span-2">
                              <Field
                                as="select"
                                name="orgName"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >
                                <option disabled value="">
                                  Select Insurer
                                </option>
                                {organizationOptions.map((option: any) => (
                                  <option key={option.id} value={option.id}>
                                    {option.orgName}
                                  </option>
                                ))}
                              </Field>
                              <div className="text-eRed text-sm italic mt-2">
                                <ErrorMessage name="orgName" />
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

export default AdminAddBranch;
