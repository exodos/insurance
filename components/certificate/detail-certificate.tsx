import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import Image from "next/image";
import { AiFillFilePdf } from "react-icons/ai";
import jsPDF from "jspdf";
// import { toPng } from "html-to-image";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const CertificateDetail = ({ certificate }) => {
  const [open, setOpen] = useState<boolean>(true);

  const saveAsPDFHandler = () => {
    let doc = new jsPDF("p", "pt", "a1");
    doc.html(document.getElementById("content"), {
      callback: function (pdf) {
        pdf.save("mypdf.pdf");
      },
    });
  };

  // const saveAsPDFHandler = () => {
  //   const doc = new jsPDF("p", "pt", "a1");

  //   autoTable(doc, {
  //     theme: "grid",
  //     head: [
  //       [
  //         "Certificate Number",
  //         "Issued Date",
  //         "Insured Name",
  //         "Region",
  //         "City",
  //         "SubCity",
  //         "Wereda",
  //         "Kebele",
  //         "House Number",
  //         "Mobile Number",
  //         "Plate Number",
  //         "Engine Number",
  //         "Chassis Number",
  //         "Vehicle Type",
  //         "Carrying Capacity",
  //         "Persons",
  //         "Policy Number",
  //         "Policy Start Date",
  //         "Policy Expire Date",
  //         "Policy Issued Conditions",
  //         "Persons Entitled To Use/Drive",
  //         "Branch Name",
  //         "Region",
  //         "City",
  //         "MobilePhone",
  //         "Premium Tarif",
  //       ],
  //     ],
  //     body: [
  //       [
  //         certificate.certificateNumber,
  //         format(new Date(certificate.issuedDate), "MMM-dd-yyyy"),
  //         certificate.insured.insuredName,
  //         certificate.insured.region,
  //         certificate.insured.city,
  //         certificate.insured.subCity,
  //         certificate.insured.wereda,
  //         certificate.insured.kebelle,
  //         certificate.insured.houseNumber,
  //         certificate.insured.mobileNumber,
  //         certificate.vehicle.plateNumber,
  //         certificate.vehicle.engineNumber,
  //         certificate.vehicle.chassisNumber,
  //         certificate.vehicle.vehicleType,
  //         certificate.vehicle.carryingCapacityInGoods,
  //         certificate.vehicle.carryingCapacityInPersons,
  //         certificate.policy.policyNumber,
  //         format(new Date(certificate.policy.policyStartDate), "MMM-dd-yyy"),
  //         format(new Date(certificate.policy.policyExpireDate), "MMM-dd-yyy"),
  //         certificate.policy.policyIssuedConditions,
  //         certificate.policy.personsEntitledToUse,
  //         certificate.branch.branchName,
  //         certificate.branch.region,
  //         certificate.branch.city,
  //         certificate.branch.mobilePhone,
  //         certificate.tariff.premiumTarif,
  //       ],
  //     ],
  //   });
  //   doc.save("table.pdf");
  // };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="flex justify-center text-center  max-w-full pl-10 sm:pl-16 pt-10 mt-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-5xl bg-gradient-to-tr from-granySmithDeepTwo to-granySmithLightThree">
                  <div className="flex h-full flex-col overflow-y-scroll shadow-xl">
                    <div className="flex-1 ">
                      <div className="overflow-auto shadow">
                        <div className="px-4 py-6 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <div className="relative flex px-2 pt-4 pb-5 md:px-0">
                                <button
                                  type="button"
                                  className="absolute top-0 inline-flex -translate-y-1/2 transform rounded-xl bg-white p-5 text-base"
                                  onClick={saveAsPDFHandler}
                                >
                                  <AiFillFilePdf className="h-6 w-6 text-lightBlue mr-1" />
                                  Download PDF
                                </button>
                              </div>
                              <Dialog.Title className="text-lg font-medium text-back">
                                <div className="sm:flex sm:items-center">
                                  <div className="sm:flex-initial">
                                    <Image
                                      className="h-20 w-auto"
                                      src="/logos/ministry-transport-logo.svg"
                                      alt="Ethiotelecom logo"
                                      width={290}
                                      height={90}
                                    />
                                  </div>
                                  <div className="sm:flex-auto sm:pl-20">
                                    <div className="text-black font-normal text-sm">
                                      <p>
                                        FDRE MINISTRY OF TRANSPORT INSURANCE
                                        FUND ADMINISTRATION AGENCY
                                      </p>
                                    </div>
                                  </div>
                                  <div className="sm:mt-0 sm:ml-16 sm:flex-none">
                                    <Image
                                      className="h-20 w-auto"
                                      src="/logos/ifaa-logo.svg"
                                      alt="TExA Logo"
                                      width={250}
                                      height={90}
                                    />
                                  </div>
                                </div>
                              </Dialog.Title>
                            </div>
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="text-gray-100 hover:text-gray-200"
                                onClick={() => setOpen(false)}
                              >
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="h-6 w-6 text-gray-800"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="content" className="pl-10">
                        <div className="overflow-hidden shadow sm:rounded-lg">
                          <div className="border-t border-gray-400">
                            <dl>
                              <div className="px-4 py-5 grid-cols-2 grid gap-4">
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    CERTIFICATE NUMBER
                                  </dt>
                                  <dd className="text-sm font-medium text-gray-900 mx-5">
                                    {certificate?.certificateNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    DATE OF ISSUANCE
                                  </dt>
                                  <dd className="text-sm font-medium text-gray-900">
                                    {format(
                                      new Date(certificate.issuedDate),
                                      "MMM-dd-yyyy"
                                    )}
                                  </dd>
                                </div>
                              </div>
                            </dl>
                          </div>
                          <div className="border-t border-gray-400">
                            <dl>
                              <div className="px-4 py-5 grid-cols-4 grid gap-4">
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    NAME OF INSURED
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.firstName} &nbsp;{" "}
                                    {certificate?.insureds?.lastName}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    REGION
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.region}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    CITY
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.city}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    SUBCITY
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.subCity}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    WEREDA
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.wereda}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    KEBELE
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.kebelle}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    HOUSE NUMBER
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.houseNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    PHONE NUMBER
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.insureds?.mobileNumber}
                                  </dd>
                                </div>
                              </div>
                            </dl>
                          </div>
                          <div className="border-t border-gray-400">
                            <dl>
                              <div className="px-4 py-5 grid-cols-3 grid gap-4">
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    PLATE NUMBER
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.vehicles?.plateNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    ENGINE NUMBER
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.vehicles?.engineNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    CHASSIS NUMBER
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.vehicles?.chassisNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    VEHICLE TYPE
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.vehicles?.vehicleType}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    CARRYING CAPACITY (QUANTALS/LITRES)
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {
                                      certificate?.vehicles
                                        ?.carryingCapacityInGoods
                                    }
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    PERSONS
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.vehicles?.passengerNumber}
                                  </dd>
                                </div>
                              </div>
                            </dl>
                          </div>
                          <div className="border-t border-gray-400">
                            <dl>
                              <div className="px-4 py-5 grid-cols-3 grid gap-4">
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    INSURER POLICY NUMBER
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.policies?.policyNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    POLICY START DATE
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {format(
                                      new Date(
                                        certificate.policies.policyStartDate
                                      ),
                                      "MMM-dd-yyyy"
                                    )}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    POLICY END DATE
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {format(
                                      new Date(
                                        certificate.policies.policyExpireDate
                                      ),
                                      "MMM-dd-yyyy"
                                    )}
                                  </dd>
                                </div>
                              </div>
                            </dl>
                          </div>
                          <div>
                            <dl>
                              <div className="px-4 py-5 grid-cols-2 grid gap-4">
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    CONDITIONS SUBJECT TO WHICH THE POLICY
                                    ISSUED
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {
                                      certificate?.policies
                                        ?.policyIssuedConditions
                                    }
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    PERSONS OR CLASSES OF PERSONS ENTITLED TO
                                    USE/DRIVE
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {
                                      certificate?.policies
                                        ?.personsEntitledToUse
                                    }
                                  </dd>
                                </div>
                              </div>
                            </dl>
                          </div>
                          <div className="border-t border-gray-400">
                            <dl>
                              <div className="px-4 py-5 grid-cols-4 grid gap-4">
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    NAME OF INSURER/Branch
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.branchs?.branchName}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    REGION
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.branchs?.region}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    PHONE NUMBER
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.branchs?.mobileNumber}
                                  </dd>
                                </div>
                                <div className="grid-cols-1 sm:grid-cols-1 sm:mt-0">
                                  <dt className="text-sm font-medium text-gray-500">
                                    Premium Tarif
                                  </dt>
                                  <dd className="text-sm text-gray-900">
                                    {certificate?.premiumTarif}
                                  </dd>
                                </div>
                              </div>
                            </dl>
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

export default CertificateDetail;
