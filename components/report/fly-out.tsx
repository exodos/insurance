import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import ReactTooltip from "react-tooltip";
import { FiChevronDown } from "react-icons/fi";
import { FaCarCrash } from "react-icons/fa";
import { RiFundsBoxFill } from "react-icons/ri";
import { AiOutlineInsurance } from "react-icons/ai";
import { TiExportOutline } from "react-icons/ti";
import Link from "next/link";

const solutions = [
  {
    name: "Daily Insurance coverage",
    description: "Number of vehicle having 3rd party insurance in a day",
    href: "/admin/report/insurance-coverage",
    reportFor: "daily",
    icon: AiOutlineInsurance,
  },
  {
    name: "Weekly Insurance coverage",
    description: "Number of vehicle having 3rd party insurance with in a week",
    href: "/admin/report/insurance-coverage",
    reportFor: "weekly",
    icon: AiOutlineInsurance,
  },
  {
    name: "Monthly Insurance coverage",
    description: "Number of vehicle having 3rd party insurance with in a month",
    href: "/admin/report/insurance-coverage",
    reportFor: "monthly",
    icon: AiOutlineInsurance,
  },
  {
    name: "Daily Fund Collection ",
    description: "10% Fund collection in a day",
    href: "#",
    icon: RiFundsBoxFill,
  },
  {
    name: "Weekly Fund Collection ",
    description: "10% Fund collection with in a week",
    href: "#",
    icon: RiFundsBoxFill,
  },
  {
    name: "Monthly Fund Collection ",
    description: "10% Fund collection with in a month",
    href: "#",
    icon: RiFundsBoxFill,
  },
  {
    name: "Daily Accident Count",
    description: "Number of accident by vehicle type in a day",
    href: "#",
    icon: FaCarCrash,
  },
  {
    name: "Weekly Accident Count",
    description: "Number of accident by vehicle type with in a week",
    href: "#",
    icon: FaCarCrash,
  },
  {
    name: "Monthly Accident Count",
    description: "Number of accident by vehicle type with in a month",
    href: "#",
    icon: FaCarCrash,
  },
  {
    name: "Export Report",
    description: "Export reports base per insurance company or branch",
    href: "#",
    icon: TiExportOutline,
  },
];

const Report = () => {
  return (
    <Popover className="relative">
      <>
        <Popover.Button
          className="inline-flex items-center gap-x-1 text-lg font-medium leading-6 text-white"
          data-tip
          data-type="light"
          data-for="listReport"
        >
          <HiOutlineDocumentReport
            className="flex-shrink-0 h-8 w-8 text-sm text-gray-50 hover:text-gray-300"
            aria-hidden="true"
          />
          <FiChevronDown className="h-5 w-5" aria-hidden="true" />
          <ReactTooltip id="listReport" place="top" effect="solid">
            List Report
          </ReactTooltip>
        </Popover.Button>
      </>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-50 mt-5 flex w-max max-w-max -translate-x-[70%] px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 lg:max-w-3xl">
            <div className="grid grid-cols-1 gap-x-6 gap-y-1 p-4 lg:grid-cols-2">
              {solutions.map((item) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                    <item.icon
                      className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div key={item.href}>
                    <Link
                      href={{
                        pathname: item.href,
                        query: {
                          reportFor: item.reportFor,
                        },
                      }}
                      passHref
                      legacyBehavior
                    >
                      <a className="font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    </Link>
                    <p className="mt-1 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* <div className="bg-gray-50 py-6 px-8">
              <div className="flex items-center gap-x-3">
                <h3 className="text-sm font-semibold leading-6 text-gray-900">
                  Enterprise
                </h3>
                <p className="rounded-full bg-indigo-600/10 py-1.5 px-2.5 text-xs font-semibold text-indigo-600">
                  New
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Empower your entire team with even more advanced tools.
              </p>
            </div> */}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
export default Report;
