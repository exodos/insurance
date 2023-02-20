import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

const AdminInsuredDetail = ({ insured }) => {
  const [open, setOpen] = useState<boolean>(true);

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
                              <Dialog.Title className="text-lg font-semibold leading-6 text-white pb-5">
                                Insured
                                <p className="mt-1 max-w-2xl text-sm text-white font-medium">
                                  Detail of Insured
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
                      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-3 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured First Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.firstName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured Last Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.lastName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.region}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  City
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.city}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  SubCity
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.subCity}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Wereda
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.wereda}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Kebele
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.kebelle}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  House Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.houseNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {insured?.mobileNumber}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                        {/* {insured?.vehicles.length > 0 && (
                          <>
                            <h1 className="px-4 text-sm font-semibold text-gray-600">
                              Vehicle
                            </h1>
                            <div className="mt-2 flex flex-col">
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
                                            #
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                          >
                                            Plate Number
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                          >
                                            Engine Number
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                          >
                                            Chassis Number
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                          >
                                            Vehicle Type
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                          >
                                            Vehicle Status
                                          </th>
                                          <th
                                            scope="col"
                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                          >
                                            Is Insured
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="bg-white">
                                        {insured?.vehicles
                                          ?.slice(0, 5)
                                          .map((item: any, itemIdx: any) => (
                                            <tr
                                              key={itemIdx}
                                              className={
                                                itemIdx % 2 === 0
                                                  ? undefined
                                                  : "bg-gray-100"
                                              }
                                            >
                                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {itemIdx + 1}
                                              </td>
                                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item?.plateNumber}
                                              </td>
                                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item?.engineNumber}
                                              </td>
                                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item?.chassisNumber}
                                              </td>
                                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item?.vehicleType}
                                              </td>
                                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item?.vehicleStatus}
                                              </td>
                                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {item?.isInsured}
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )} */}
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

export default AdminInsuredDetail;
