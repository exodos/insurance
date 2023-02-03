import { Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Disclosure } from "@headlessui/react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  Bars3CenterLeftIcon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import MyLink from "./my-link";
import { useRouter } from "next/router";
import { Icons } from "./icons";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  children: ReactNode;
};

const NavBar = ({ navigation, children }) => {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dayTime, setDayTime] = useState("");

  const now = new Date();
  const router = useRouter();

  useEffect(() => {
    getDayTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDayTime = () => {
    if (now.getHours() > 5 && now.getHours() <= 12) {
      setDayTime("Good Morning");
    } else if (now.getHours() > 12 && now.getHours() <= 18) {
      setDayTime("Good Afternoon");
    } else if (now.getHours() > 18 && now.getHours() <= 22) {
      setDayTime("Good Evening");
    }
  };

  const handleSearch = (event) => {
    // event.preventDefault();
    if (event.key === "Enter") {
      const path = router.pathname;
      const query = router.query;
      query.search = event.target.value;
      router.push({
        pathname: path,
        query: query,
      });
    }
  };

  return (
    <>
      <div className="min-h-full">
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-100 pt-5 pb-4">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                          type="button"
                          className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex flex-shrink-0 items-center px-4">
                      <Image
                        // className="h-20 w-auto"
                        className="h-16 w-auto"
                        src={"/logos/ethio-logo.svg"}
                        alt="TeleBirr Logo"
                        width={900}
                        height={600}
                        priority
                      />
                    </div>
                    <nav className="mt-5 h-full divide-y divide-cyan-800 overflow-y-auto">
                      <div className="space-y-1 px-2">
                        {navigation.map((item) =>
                          !item.children ? (
                            <div key={item.name}>
                              <MyLink href={item.href}>
                                <a
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-200 text-gray-500"
                                      : "text-gray-800 hover:text-white hover:bg-gray-300",
                                    "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                                  )}
                                  aria-current={
                                    item.current ? "page" : undefined
                                  }
                                >
                                  <Icons rows={item.icon} />
                                  {item.name}
                                </a>
                              </MyLink>
                            </div>
                          ) : (
                            <Disclosure
                              as="div"
                              key={item.name}
                              className="space-y-1"
                            >
                              {({ open }) => (
                                <>
                                  <Disclosure.Button
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-200 text-gray-500"
                                        : "text-gray-800 hover:text-white hover:bg-gray-300",
                                      "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    )}
                                  >
                                    <Icons rows={item.icon} />
                                    <span className="flex-1">{item.name}</span>
                                    <svg
                                      className={classNames(
                                        open
                                          ? "text-gray-400 rotate-90"
                                          : "text-gray-300",
                                        "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                      )}
                                      viewBox="0 0 20 20"
                                      aria-hidden="true"
                                    >
                                      <path
                                        d="M6 6L14 10L6 14V6Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="space-y-1">
                                    {item.children.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        passHref
                                        legacyBehavior
                                      >
                                        <a>
                                          <Disclosure.Button
                                            key={subItem.name}
                                            // as="a"
                                            // href={subItem.href}
                                            className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-white hover:bg-gray-300"
                                          >
                                            {subItem.name}
                                          </Disclosure.Button>
                                        </a>
                                      </Link>
                                    ))}
                                  </Disclosure.Panel>
                                </>
                              )}
                            </Disclosure>
                          )
                        )}
                      </div>
                    </nav>
                    <div className="flex flex-shrink-0 p-4">
                      <Link href={"/"} legacyBehavior passHref>
                        <a className="group block flex-shrink-0">
                          <div className="flex items-center">
                            <div>
                              <Image
                                // className="h-20 w-auto"
                                className="inline-block h-16 w-auto rounded-full"
                                src={"/logos/telebirr-logo.svg"}
                                alt="TeleBirr Logo"
                                width={900}
                                height={600}
                                priority
                              />
                            </div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
                {/* <div className="w-14 flex-shrink-0" aria-hidden="true">
              </div> */}
              </div>
            </Dialog>
          </Transition.Root>

          <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-grow flex-col overflow-y-auto bg-white pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <Image
                  // className="h-20 w-auto"
                  className="h-16 w-auto"
                  src={"/logos/ethio-logo.svg"}
                  alt="TeleBirr Logo"
                  width={900}
                  height={600}
                  priority
                />
              </div>
              <nav
                className="mt-10 flex flex-1 flex-col divide-y divide-cyan-800 overflow-y-auto"
                aria-label="Sidebar"
              >
                <div className="space-y-1 px-2">
                  {navigation.map((item) =>
                    !item.children ? (
                      <div key={item.name}>
                        <MyLink href={item.href}>
                          <a
                            className={classNames(
                              item.current
                                ? "bg-gray-200 text-gray-500"
                                : "text-gray-800 hover:text-white hover:bg-gray-300",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <Icons rows={item.icon} />
                            {item.name}
                          </a>
                        </MyLink>
                      </div>
                    ) : (
                      <Disclosure
                        as="div"
                        key={item.name}
                        className="space-y-1"
                      >
                        {({ open }) => (
                          <>
                            <Disclosure.Button
                              className={classNames(
                                item.current
                                  ? "bg-gray-200 text-gray-500"
                                  : "text-gray-800 hover:text-white hover:bg-gray-300",
                                "group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              )}
                            >
                              <Icons rows={item.icon} />
                              <span className="flex-1">{item.name}</span>
                              <svg
                                className={classNames(
                                  open
                                    ? "text-gray-400 rotate-90"
                                    : "text-gray-300",
                                  "ml-3 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150"
                                )}
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path
                                  d="M6 6L14 10L6 14V6Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </Disclosure.Button>
                            <Disclosure.Panel className="space-y-1">
                              {item.children.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  passHref
                                  legacyBehavior
                                >
                                  <a>
                                    <Disclosure.Button
                                      key={subItem.name}
                                      // as="a"
                                      // href={subItem.href}
                                      className="group w-full flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-white hover:bg-gray-300"
                                    >
                                      {subItem.name}
                                    </Disclosure.Button>
                                  </a>
                                </Link>
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )
                  )}
                </div>
              </nav>
              <div className="flex flex-shrink-0 p-2">
                <Link href={"/"} legacyBehavior passHref>
                  <a className="group block w-full flex-shrink-0">
                    <div className="flex items-center">
                      <div>
                        <Image
                          // className="h-20 w-auto"
                          className="inline-block h-20 w-auto rounded-full"
                          src={"/logos/telebirr-logo.svg"}
                          alt="TeleBirr Logo"
                          width={200}
                          height={200}
                          priority
                        />
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="min-h-0">
            <div className="flex flex-1 flex-col lg:pl-64 bg-lightGreen pb-36">
              <div className="flex flex-1 h-16 flex-shrink-0 lg:border-none mt-5">
                <div className="flex items-center lg:ml-12">
                  <div className="hidden lg:block">
                    <h1 className="ml-3 text-xl font-bold leading-7 text-gray-50 sm:truncate sm:leading-9 capitalize">
                      {dayTime}, {session?.user?.firstName}{" "}
                      {session?.user?.lastName}
                    </h1>
                  </div>
                </div>
                <button
                  type="button"
                  className="border-r border-gray-800 px-4 text-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-8xl lg:px-8">
                  <div className="flex flex-1">
                    <div className="flex w-full md:ml-0">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                        <div
                          className="pointer-events-none absolute inset-y-0 left-0 flex items-center"
                          aria-hidden="true"
                        >
                          <MagnifyingGlassIcon
                            className="h-8 w-8 ml-6 pr-1"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="search"
                          name="search"
                          className="block h-full w-full border-transparent py-2 pl-10 pr-5 ml-4 text-gray-900 bg-gray-100 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm rounded-2xl"
                          placeholder="Enter your keywords ..."
                          type="search"
                          onKeyDown={() => {
                            handleSearch(event);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center md:ml-6">
                    <button
                      type="button"
                      className="rounded-full p-1 text-gray-50 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-deepGreen">
                          <FaUserCircle className="h-8 w-8 rounded-full text-white" />

                          <span className="ml-1 hidden text-sm font-medium text-gray-50 lg:block">
                            <span className="sr-only">Open user menu for </span>
                            {session?.user?.firstName}
                          </span>
                          <ChevronDownIcon
                            className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-800 lg:block"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              // <Link href={"/"} legacyBehavior passHref>
                              <MyLink href={"/"}>
                                <a
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Your Profile
                                </a>
                              </MyLink>
                              // </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  signOut();
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="-mt-40">
          <main className="flex-1 pb-10 flex-col lg:pl-64">
            <div className="mt-8">
              <div className="sm:block">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default NavBar;
