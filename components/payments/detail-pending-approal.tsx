import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

const DetailPendingApproval = ({ payment }) => {
  const [open, setOpen] = useState<boolean>(true);
  let slicedValue = null;
  slicedValue = payment?.certificates?.slice(0, 10);

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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      <div className="overflow-hidden bg-lightGreen shadow">
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-lg font-semibold leading-6 text-white mt-5">
                                Payment
                                <p className="mt-1 max-w-2xl text-sm text-white font-medium">
                                  Detail of Pending Approval Payment
                                </p>
                              </Dialog.Title>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6 text-white"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-hidden bg-white shadow sm:rounded-lg pt-2 pb-4">
                        <dl>
                          <div className="bg-white px-4 py-5 grid-cols-4 grid gap-4">
                            <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                              <dt className="text-sm font-medium text-gray-500">
                                Ref Number
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {payment?.refNumber}
                              </dd>
                            </div>
                            <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                              <dt className="text-sm font-medium text-gray-500">
                                Insured First Name
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {payment?.insureds?.firstName}
                              </dd>
                            </div>
                            <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                              <dt className="text-sm font-medium text-gray-500">
                                Insured Last Name
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {payment?.insureds?.lastName}
                              </dd>
                            </div>
                            <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                              <dt className="text-sm font-medium text-gray-500">
                                Insured mobileNumber
                              </dt>
                              <dd className="text-sm text-gray-900">
                                {payment?.insureds?.mobileNumber}
                              </dd>
                            </div>
                          </div>
                        </dl>
                        {payment?.certificates && (
                          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-3xl">
                                <table className="min-w-full divide-y divide-gray-300">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        scope="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-medium text-gray-900 sm:pl-6"
                                      >
                                        #
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-medium text-gray-800"
                                      >
                                        Certificate #
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-medium text-gray-800"
                                      >
                                        Status
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                                      >
                                        Premium Tarif
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                                      >
                                        Policy #
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                                      >
                                        Policy Start Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                                      >
                                        Policy Expire Date
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-medium text-gray-900"
                                      >
                                        Plate Number
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200 bg-white">
                                    {slicedValue.map((item: any, i: any) => (
                                      <tr key={i}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                          {i + 1}
                                        </td>
                                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                                          {item?.certificateNumber}
                                        </td>
                                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                                          {item?.status}
                                        </td>
                                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                                          {item?.premiumTarif}
                                        </td>
                                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                                          {item?.policies?.policyNumber}
                                        </td>
                                        <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                                          {format(
                                            new Date(
                                              item.policies.policyStartDate
                                            ),
                                            "MMM-dd-yyyy"
                                          )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {format(
                                            new Date(
                                              item.policies.policyExpireDate
                                            ),
                                            "MMM-dd-yyyy"
                                          )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                          {item?.vehicles?.plateNumber}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DetailPendingApproval;
