import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListVehicle from "@/vehicle/list-vehicles";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";

const FeedVehicleByStatus = gql`
  query FeedVehicleByStatus(
    $input: statusInput!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [VehicleOrderByInput!]
    $feedBranchByOrgDescInput2: orgDescInput!
  ) {
    feedVehicleByStatus(
      input: $input
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
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
        vehicleCategory
        premiumTarif
        passengerNumber
        carryingCapacityInGoods
        purchasedYear
        dutyFreeValue
        dutyPaidValue
        vehicleStatus
        status
        isInsured
        createdAt
        updatedAt
        insureds {
          id
          regNumber
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
    feedUniqueTariff {
      tariffVehicleType {
        id
        vehicleType
      }
      tariffVehicleSubType {
        id
        vehicleSubType
      }
      tariffVehicleDetail {
        id
        vehicleDetail
      }
      tariffVehicleUsage {
        id
        vehicleUsage
      }
      tariffVehicleCategory {
        id
        vehicleCategory
      }
    }
    feedBranchByOrgDesc(input: $feedBranchByOrgDescInput2) {
      branchs {
        id
        branchName
      }
    }
  }
`;

const AdminApprovedVehiclePage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { pathname, asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Approved Vehicle Page"}
        content={"Third Party Insurance Approved Vehicle Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Vehicle</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Approved Vehicles
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <Link
                    href={{
                      pathname: "/admin/vehicle/add-vehicle",
                      query: {
                        returnPage: pathname,
                      },
                    }}
                    passHref
                    legacyBehavior
                  >
                    <button type="button" className="inline-flex items-center">
                      <BsPlusCircleFill
                        className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                        aria-hidden="true"
                      />
                    </button>
                  </Link>
                )}
                {/* {session.user.memberships.role === "SUPERADMIN" && (
                  <Link
                    href={{
                      pathname: "/admin/vehicle/export-vehicle",
                      query: {
                        returnPage: asPath,
                      },
                    }}
                    passHref
                    legacyBehavior
                  >
                    <button type="button" className="inline-flex items-center">
                      <BsFillArrowUpCircleFill
                        className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                        aria-hidden="true"
                      />
                    </button>
                  </Link>
                )} */}
              </div>
            )}
          </div>
        </div>
        <ListVehicle
          vehicleData={data.feedVehicleByStatus}
          regionCode={data.regionCode}
          codeList={data.plateCode}
          branch={data.feedBranchByOrgDesc.branchs}
          tariffData={data.feedUniqueTariff}
          pageStatus={"Approved"}
        />
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
    query: FeedVehicleByStatus,
    variables: {
      input: {
        status: "APPROVED",
      },
      feedBranchByOrgDescInput2: {
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

export default AdminApprovedVehiclePage;
