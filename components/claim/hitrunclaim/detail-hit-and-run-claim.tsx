import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

const HitAndRunClaimDetails = ({ hitAndRunclaim }) => {
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      <div className="overflow-hidden bg-lightGreen shadow">
                        <div className="px-4 py-5 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-xl font-semibold leading-6 text-white">
                                Hit And Run claim
                                <p className="mt-1 text-lg text-white font-medium">
                                  Detail of hit and run claim
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
                                  Claim Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.claimNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Damage Estimate
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.damageEstimate}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Claimed Date
                                </dt>

                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(hitAndRunclaim.claimedAt),
                                    "MMM-dd-yyy"
                                  )}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Claim FullName
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.claimerFullName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Claimer Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.claimerRegion}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Claimer PhoneNumber
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.claimerPhoneNumber}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-3 grid gap-3">
                              <div className="grid-cols-3 sm:grid-cols-3 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Branch Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.branchs?.branchName}
                                </dd>
                              </div>
                              <div className="grid-cols-3 sm:grid-cols-3 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.branchs?.region}
                                </dd>
                              </div>
                              <div className="grid-cols-3 sm:grid-cols-3 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {hitAndRunclaim?.branchs?.mobileNumber}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
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

export default HitAndRunClaimDetails;
