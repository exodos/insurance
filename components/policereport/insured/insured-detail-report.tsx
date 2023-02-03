import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";

const DetailInsuredPoliceReportModal = ({ policeReport }) => {
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
                              <Dialog.Title className="text-xl font-semibold leading-6 text-white mt-5">
                                Police Report
                                <p className="mt-1 text-lg text-white font-medium">
                                  Detail of police report
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
                            <div className="bg-white px-4 py-5 grid-cols-4 grid gap-4">
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Incident Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.incidentNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Victim Driver Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.victimDriverName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Licence Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.victimLicenceNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Level
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.victimLevel}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.victimRegion}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  City
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.victimCity}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Phone Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.victimPhoneNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Incident Cause
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.incidentCause}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Incident Date
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {format(
                                    new Date(policeReport.incidentDate),
                                    "MMM-dd-yyyy"
                                  )}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Incident Place
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.incidentPlace}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Incident Time
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.incidentTime}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Responsible Driver Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.responsibleDriverName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Phone Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.responsiblePhoneNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Traffic Police Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.trafficPolices.firstName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Traffic Police PhoneNumber
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.trafficPolices.mobileNumber}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Police Station Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.policeBranch.branchName}
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
                                  Victim Plate Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_victimVehicle
                                      ?.plateNumber
                                  }
                                </dd>
                              </div>{" "}
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Vehicle Type
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_victimVehicle
                                      ?.vehicleType
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_victimVehicle
                                      ?.insureds?.insuredName
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_victimVehicle
                                      ?.insureds?.mobileNumber
                                  }
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
                                  Insurer Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.branchs?.branchName}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Region
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.branchs?.region}
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  City
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {policeReport?.branchs?.city}
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
                                  Responsible Vehicle PlateNumber
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_responsibleVehicle
                                      ?.plateNumber
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Vehicle Type
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_responsibleVehicle
                                      ?.vehicleType
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Insured Name
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_responsibleVehicle
                                      ?.insureds?.insuredName
                                  }
                                </dd>
                              </div>
                              <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                <dt className="text-sm font-medium text-gray-500">
                                  Mobile Number
                                </dt>
                                <dd className="text-sm text-gray-900">
                                  {
                                    policeReport
                                      ?.vehicle_PoliceReport_responsibleVehicle
                                      ?.insureds?.mobileNumber
                                  }
                                </dd>
                              </div>
                            </div>
                          </dl>
                        </div>
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
                                        Victim Name
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Victim Condition
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Injury Type
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Address
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Family PhoneNumber
                                      </th>
                                      <th
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Hospitalized
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white">
                                    {policeReport?.victims?.map(
                                      (item: any, itemIdx: any) => (
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
                                            {item.victimName}
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.victimCondition}
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.injuryType}
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.victimAddress}
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.victimFamilyPhoneNumber}
                                          </td>
                                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {item.victimHospitalized}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
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

export default DetailInsuredPoliceReportModal;
