import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

const VehicleDetails = ({ vehicle }) => {
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
                              <Dialog.Title className="text-lg font-semibold leading-6 text-white mt-5">
                                Vehicle
                                <p className="mt-1 max-w-2xl text-sm text-white font-medium">
                                  Detail of Vehicles
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
                      <div className="overflow-hidden bg-white shadow sm:rounded-lg pb-4">
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-4 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Plate Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.plateNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Engine Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.engineNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Chassis Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.chassisNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Vehicle Type
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.vehicleType}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Goods Carrying Capacity
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.carryingCapacityInGoods}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Persons Carrying Capacity
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.carryingCapacityInPersons}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Vehicle Status
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.vehicleStatus}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Is Insured
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.isInsured}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-4 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.insureds?.insuredName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.insureds?.region}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  City
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.insureds.city}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.insureds?.mobileNumber}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-4 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Branch Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.branchs?.branchName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.branchs?.region}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  City
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.branchs.city}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {vehicle?.branchs.mobileNumber}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                        {vehicle.certificates && (
                          <div className="border-t border-gray-300">
                            <dl>
                              <div className="bg-white px-4 py-5 grid-cols-4 grid gap-4">
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Certificate Number
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {vehicle?.certificates?.certificateNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Issued Date
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {format(
                                      new Date(vehicle.certificates.issuedDate),
                                      "MMM-dd-yyyy"
                                    )}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Policy Number
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {
                                      vehicle?.certificates?.policies
                                        ?.policyNumber
                                    }
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Policy Start Date
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {format(
                                      new Date(
                                        vehicle.certificates.policies.policyStartDate
                                      ),
                                      "MMM-dd-yyyy"
                                    )}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Policy Expire Date
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {format(
                                      new Date(
                                        vehicle.certificates.policies.policyExpireDate
                                      ),
                                      "MMM-dd-yyyy"
                                    )}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Policy Issued Conditions
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {
                                      vehicle?.certificates?.policies
                                        ?.policyIssuedConditions
                                    }
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Persons Entitled To Use/Drive
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {
                                      vehicle?.certificates?.policies
                                        ?.personsEntitledToUse
                                    }
                                  </dd>
                                </div>
                              </div>
                            </dl>
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

export default VehicleDetails;
