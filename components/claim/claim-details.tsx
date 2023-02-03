import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

const ClaimDetails = ({ claim }) => {
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
                              <Dialog.Title className="text-xl font-semibold leading-6 text-white">
                                Claim
                                <p className="mt-1 text-lg text-white font-medium">
                                  Detail of claim
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
                                  {claim?.claimNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Damage Estimate
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.damageEstimate}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Claimed Date
                                </dt>

                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(claim.claimedAt),
                                    "MMM-dd-yyy"
                                  )}
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
                                  Incident Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.insuredPoliceReports?.incidentNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Victim Licence Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    claim?.insuredPoliceReports
                                      ?.victimLicenceNumber
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Victim Level
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.insuredPoliceReports?.victimLevel}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Victim PhoneNumber
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    claim?.insuredPoliceReports
                                      ?.victimPhoneNumber
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Incident Date
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(
                                      claim.insuredPoliceReports.incidentDate
                                    ),
                                    "MMM-dd-yyyy"
                                  )}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Responsible PhoneNumber
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    claim?.insuredPoliceReports
                                      ?.responsiblePhoneNumber
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Police Station Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    claim?.insuredPoliceReports?.policeBranch
                                      .branchName
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Report Date
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(
                                      claim.insuredPoliceReports.reportDate
                                    ),
                                    "MMM-dd-yyyy"
                                  )}
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
                                  {claim?.insureds?.insuredName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.insureds?.region}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured City
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.insureds?.city}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.insureds?.mobileNumber}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-3 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  PlateNumber
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.vehicles?.plateNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  EngineNumber
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.vehicles?.engineNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Chassis Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.vehicles?.chassisNumber}
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
                                  {claim?.branchs?.branchName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.branchs?.region}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  City
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.branchs?.city}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.branchs?.mobileNumber}
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
                        <div className="border-t border-gray-300">
                          <dl>
                            <div className="bg-white px-4 py-5 grid-cols-3 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Certificate Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.certificates?.certificateNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Issued Date
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(claim.certificates.issuedDate),
                                    "MMM-dd-yyyy"
                                  )}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Policy Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.certificates?.policies?.policyNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Policy Start Date
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(
                                      claim.certificates.policies.policyStartDate
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
                                      claim.certificates.policies.policyExpireDate
                                    ),
                                    "MMM-dd-yyyy"
                                  )}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Premium Tarif
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {claim?.certificates?.tariffs?.premiumTarif}
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

export default ClaimDetails;
