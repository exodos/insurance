import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/router";
import VehicleByRegNumber from "@/components/common/vehicle-by-reg";
import { gql } from "apollo-server-micro";
import { initializeApollo } from "@/lib/apollo";
import VehicleByPlateNumber from "@/components/common/vehicle-plate";
import VehicleByMobileNumber from "@/components/common/vehicle-by-mobile";
import AdminVehicleByMobileNumber from "@/components/common/admin-vehicle-by-mobile";
import AdminVehicleByRegNumber from "@/components/common/admin-vehicle-by-reg";
import { authOptions } from "../api/auth/[...nextauth]";

const FeedBranchByOrgDesc = gql`
  query FeedBranchByOrgDesc($input: orgDescInput!) {
    feedBranchByOrgDesc(input: $input) {
      branchs {
        id
        branchName
      }
    }
    plateCode {
      id
      code
    }
    regionCode {
      id
      regionApp
    }
  }
`;

const AdminAddCertificate = ({
      data,
      branchId,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [showPlateForm, setShowPlateForm] = useState(false);
  const router = useRouter();
  const path = router.query.returnPage;

  const handleOnChange = (e: any) => {
    e.preventDefault();
    const selectedValue = e.target.value;
    if (selectedValue === "mobileNumber") {
      setShowMobileForm(true);
      setShowRegForm(false);
      setShowPlateForm(false);
    } else if (selectedValue === "regNumber") {
      setShowMobileForm(false);
      setShowRegForm(true);
      setShowPlateForm(false);
    } else if (selectedValue === "plateNumber") {
      setShowMobileForm(false);
      setShowRegForm(false);
      setShowPlateForm(true);
    }
  };
  return (
    <>
      <Head>
        <title>Add Certificate</title>
        <meta
          name="description"
          content="Third Party Insurance Add Certificate"
        />
      </Head>
      <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white mt-24 rounded-3xl">
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="space-y-6 sm:space-y-5">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Certificate
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
                id="searchBy"
                name="searchBy"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => handleOnChange(e)}
                defaultValue={""}
              >
                <option disabled value="">
                  Please select an option
                </option>
                <option value="mobileNumber">Insured Mobile Number</option>
                <option value="regNumber">Insured Registration Number</option>
                <option value="plateNumber">Vehicle Plate Number</option>
              </select>
            </div>
          </form>
          {showMobileForm && (
            <AdminVehicleByMobileNumber branchId={branchId} path={path} />
          )}
          {showRegForm && (
            <AdminVehicleByRegNumber branchId={branchId} path={path} />
          )}
          {showPlateForm && (
            <VehicleByPlateNumber
              code={data.plateCode}
              region={data.regionCode}
              branchId={branchId}
              path={path}
            />
          )}
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
        destination: "/auth/signin",
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

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedBranchByOrgDesc,
    variables: {
      input: {
        description: "INSURANCE",
      },
    },
  });

  //   console.log(data.feedBranchByOrgDesc.branchs);

  return {
    props: {
      session,
      data,
      branchId: session.user.memberships.branchId,
    },
  };
};

export default AdminAddCertificate;
