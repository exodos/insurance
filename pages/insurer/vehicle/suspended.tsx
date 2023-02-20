import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import ListVehicle from "@/vehicle/list-vehicles";
import SiteHeader from "@/components/layout/header";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Link from "next/link";

const FeedVehicleInsurerByStatus = gql`
  query FeedVehicleInsurerByStatus(
    $input: statusInput!
    $orgId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [VehicleOrderByInput!]
  ) {
    feedVehicleInsurerByStatus(
      input: $input
      orgId: $orgId
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
    feedBranchByOrg(orgId: $orgId) {
      branchs {
        id
        branchName
        mobileNumber
      }
    }
  }
`;

const InsurerSuspendedVehiclePage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { pathname, asPath } = useRouter();
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Suspended Vehicle Page"}
        content={"Third Party Insurance Suspended Vehicles For Branch"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-white">Vehicle</h1>
              <p className="text-base font-medium text-gray-100">
                List Of All Suspended Vehicles
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "INSURER" && (
                  <Link
                    href={{
                      pathname: "/insurer/vehicle/insurer-add-vehicle",
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
                {session.user.memberships.role === "INSURER" && (
                  <Link
                    href={{
                      pathname: "/insurer/vehicle/export-vehicle",
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
                )}
              </div>
            )}
          </div>
        </div>
        <ListVehicle
          vehicleData={data.feedVehicleInsurerByStatus}
          regionCode={data.regionCode}
          codeList={data.plateCode}
          branch={data.feedBranchByOrg.branchs}
          tariffData={data.feedUniqueTariff}
          pageStatus={"Suspended"}
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
    query: FeedVehicleInsurerByStatus,
    variables: {
      input: {
        status: "SUSPENDED",
      },
      orgId: session.user.memberships.branchs.orgId,
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

export default InsurerSuspendedVehiclePage;
