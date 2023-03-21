import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { useState } from "react";
import { useRouter } from "next/router";
import { gql } from "apollo-server-micro";
import ImportVehicleByRegNumber from "@/components/common/import-vehicle-by-reg";
import ImportVehicleByMobile from "@/components/common/import-vehicle-mobile";
import { initializeApollo } from "@/lib/apollo";
import ImportVehicleByReg from "@/components/common/import-vehicle-reg";

const AdminImportCertificateByInsureds = ({
      branchId,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);

  const router = useRouter();
  const path = router.query.returnPage;

  const selectOptions = [
    { value: "mobileNumber", label: "Insured Mobile Number" },
    { value: "regNumber", label: "Insured Registration Number" },
  ];

  const handleOnChange = (e: any) => {
    e.preventDefault();
    const selectedValue = e.target.value;
    if (selectedValue === "mobileNumber") {
      setShowMobileForm(true);
      setShowRegForm(false);
    } else if (selectedValue === "regNumber") {
      setShowMobileForm(false);
      setShowRegForm(true);
    }
  };
  return (
    <>
      <Head>
        <title>Import And Create Certificate</title>
        <meta
          name="description"
          content="Third Party Insurance Import And Create Certificate"
        />
      </Head>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white mt-24 rounded-3xl">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Search Insured
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Click To Search By
              </p>
            </div>
          </div>
          <form className="space-y-6 sm:space-y-5 sm:pt-8">
            <div className="max-w-[70%] mx-auto px-4">
              <label
                htmlFor="searchBy"
                className="block text-base font-medium leading-6 text-gray-900"
              >
                Search By
              </label>
              <select
                name="searchBy"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => handleOnChange(e)}
                defaultValue={""}
              >
                <option disabled value="">
                  Please select an option
                </option>
                {selectOptions.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
          {showMobileForm && <ImportVehicleByMobile path={path} />}
          {showRegForm && <ImportVehicleByReg path={path} />}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/sign-in",
      },
    };
  } else if (session.user.memberships.role !== "SUPERADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default AdminImportCertificateByInsureds;
