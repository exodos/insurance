import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import { useRouter } from "next/router";
import SiteHeader from "@/layout/header";
import ListTariff from "@/components/tariff/list-tariff";
import AddTariffModal from "@/components/tariff/add-tariff";
import Link from "next/link";
import Report from "@/components/report/fly-out";
import ReactTooltip from "react-tooltip";

const FeedTariff = gql`
  query FeedTariff(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [TariffOrderByInput!]
  ) {
    feedTariff(filter: $filter, skip: $skip, take: $take, orderBy: $orderBy) {
      tariff {
        id
        vehicleType
        vehicleSubType
        vehicleDetail
        vehicleUsage
        vehicleCategory
        premiumTarif
        createdAt
        updatedAt
      }
      totalTariff
      maxPage
    }
  }
`;

const TariffPage = ({
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
        title={"Third Party Insurance Tariff Page"}
        content={"Third Party Insurance Tariff Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-14 sm:px-2 lg:px-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Tariff</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Tariff
              </p>
            </div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <Report />
              </div>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <>
                    <>
                      <button
                        type="button"
                        className="inline-flex items-center"
                        data-tip
                        data-type="light"
                        data-for="createTariff"
                        onClick={() => handleAdd()}
                      >
                        <BsPlusCircleFill
                          className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                          aria-hidden="true"
                        />
                      </button>
                      <ReactTooltip
                        id="createTariff"
                        place="top"
                        effect="solid"
                      >
                        Create Tariff
                      </ReactTooltip>
                    </>
                    <Link
                      href={{
                        pathname: "/admin/tariff/export-tariff",
                        query: {
                          returnPage: asPath,
                        },
                      }}
                      passHref
                    >
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center pt-2"
                          data-tip
                          data-type="light"
                          data-for="exportTariff"
                        >
                          <BsFillArrowUpCircleFill
                            className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                            aria-hidden="true"
                          />
                        </button>
                        <ReactTooltip
                          id="exportTariff"
                          place="top"
                          effect="solid"
                        >
                          Export Tariff
                        </ReactTooltip>
                      </>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <ListTariff tariffData={data.feedTariff} />
      </div>
      {showAddModal ? <AddTariffModal /> : null}
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

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 10;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedTariff,
    variables: {
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

export default TariffPage;
