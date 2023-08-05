import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListOrganizations from "@/organizations/list-organizations";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";
import { useRouter } from "next/router";
import Report from "@/components/report/fly-out";
import ReactTooltip from "react-tooltip";
import ListLogs from "@/components/logs/list-logs";

const FeedThirdPartyLogs = gql`
  query FeedThirdPartyLogs(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [LogOrderByInput!]
  ) {
    feedThirdPartyLogs(
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      thirdPartyLogs {
        id
        userEmail
        action
        mode
        oldValue
        newValue
        timeStamp
        branchCon {
          branchName
        }
      }
      totalThirdPartyLogs
      maxPage
    }
  }
`;

const AdminHistoryPage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  const { asPath, pathname } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Insurer Page"}
        content={"Third Party Insurance Insurer Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-14 sm:px-2 lg:px-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Operation Logs
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Operation Logs
              </p>
            </div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <Report />
              </div>
            </div>
            {/* {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <>
                    <Link
                      href={{
                        pathname: "/admin/logs/export-logs",
                        query: {
                          returnPage: asPath,
                        },
                      }}
                      passHref
                    >
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center"
                          data-tip
                          data-type="light"
                          data-for="exportLogs"
                        >
                          <BsFillArrowUpCircleFill
                            className="flex-shrink-0 mt-2 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                            aria-hidden="true"
                          />
                        </button>
                        <ReactTooltip
                          id="exportLogs"
                          place="top"
                          effect="solid"
                        >
                          Export Logs
                        </ReactTooltip>
                      </>
                    </Link>
                  </>
                )}
              </div>
            )} */}
          </div>
        </div>
        <ListLogs logiData={data.feedThirdPartyLogs} />
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

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 10;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedThirdPartyLogs,
    variables: {
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          timeStamp: "desc",
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

export default AdminHistoryPage;
