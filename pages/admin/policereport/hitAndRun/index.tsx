import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { initializeApollo } from "../../../../lib/apollo";
import { gql } from "@apollo/client";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { authOptions } from "pages/api/auth/[...nextauth]";
import ListHitAndRun from "@/policereport/hitandrun/list-hit-and-run";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";

const FeedHitAndRunPoliceReport = gql`
  query FeedHitAndRunPoliceReport(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [HitAndRunPoliceReportOrderByInput!]
  ) {
    feedHitAndRunPoliceReport(
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      hitAndRunPoliceReport {
        id
        incidentNumber
        incidentCause
        incidentDate
        incidentPlace
        incidentTime
        reportDate
        branchs {
          id
          branchName
          region
        }
        policeBranch {
          id
          branchName
          region
        }
        trafficPolices {
          id
          firstName
          lastName
          mobileNumber
        }
      }
      totalHitAndRunPoliceReport
      maxPage
    }
  }
`;

const AdminHitAndRunPoliceReport = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Hit And Run Police Report Page"}
        content={"Third Party Insurance Hit And Run Police Report Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Hit And Run Police Report
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Hit And Run Police Reports
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <Link
                    href={{
                      pathname:
                        "/admin/policereport/hitAndRun/export-hit-and-run",
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
        <ListHitAndRun
          hitAndRunData={data.feedHitAndRunPoliceReport}
          href={asPath}
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
  } else if (session.user.memberships.role !== "SUPERADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // console.log(session.user);

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 20;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedHitAndRunPoliceReport,
    variables: {
      orgId: "1932fcdc-1694-48b2-b286-e9458329a574",
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          reportDate: "desc",
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

export default AdminHitAndRunPoliceReport;
