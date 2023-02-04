import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListVehicle from "@/vehicle/list-vehicles";
import AddVehicleModal from "@/vehicle/add-vehicle";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";

const FeedVehicle = gql`
  query FeedVehicle(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [VehicleOrderByInput!]
    $input: orgDescInput!
  ) {
    feedVehicle(filter: $filter, skip: $skip, take: $take, orderBy: $orderBy) {
      vehicle {
        id
        plateNumber
        engineNumber
        chassisNumber
        vehicleModel
        bodyType
        horsePower
        manufacturedYear
        vehicleType
        vehicleSubType
        vehicleDetails
        vehicleUsage
        passengerNumber
        carryingCapacityInGoods
        purchasedYear
        dutyFreeValue
        dutyPaidValue
        vehicleStatus
        isInsured
        createdAt
        updatedAt
        insureds {
          id
          firstName
          lastName
          mobileNumber
        }
        branchs {
          id
          branchName
        }
      }
      totalVehicle
      maxPage
    }
    plateCode {
      id
      code
    }
    regionCode {
      id
      regionApp
    }
    feedBranchByOrgDesc(input: $input) {
      branchs {
        id
        branchName
      }
    }
  }
`;

const AdminVehiclePage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const { asPath } = useRouter();

  const handleAdd = () => {
    setShowAddModal((prev) => !prev);
  };
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Vehicle Page"}
        content={"Third Party Insurance Vehicle Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Vehicle</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Vehicles
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <button
                    type="button"
                    className="inline-flex items-center"
                    onClick={() => handleAdd()}
                  >
                    <BsPlusCircleFill
                      className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                      aria-hidden="true"
                    />
                  </button>
                )}
                {session.user.memberships.role === "SUPERADMIN" && (
                  <button type="button" className="inline-flex items-center">
                    <BsFillArrowUpCircleFill
                      className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <ListVehicle
          vehicleData={data.feedVehicle}
          regionCode={data.regionCode}
          codeList={data.plateCode}
          branch={data.feedBranchByOrgDesc.branchs}
        />
      </div>
      {showAddModal ? (
        <AddVehicleModal
          regionCode={data.regionCode}
          codeList={data.plateCode}
          branch={data.feedBranchByOrgDesc.branchs}
          href={asPath}
        />
      ) : null}
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
  }

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 20;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedVehicle,
    variables: {
      input: {
        description: "INSURANCE",
      },
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    },
  });

  return {
    props: {
      session,
      data,
    },
  };
};

export default AdminVehiclePage;
