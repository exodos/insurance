import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { gql } from "@apollo/client";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { useState } from "react";
import ListHitAndRun from "@/policereport/hitandrun/list-hit-and-run";
import CreateHitAndRunModal from "@/policereport/hitandrun/create-hit-and-run";
import { initializeApollo } from "lib/apollo";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import { getServerSession } from "next-auth";

const FeedHitAndRunReportPolice = gql`
  query FeedHitAndRunReportPolice(
    $branchId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [HitAndRunPoliceReportOrderByInput!]
    $input: orgDescInput!
  ) {
    feedHitAndRunReportPolice(
      branchId: $branchId
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
    feedBranchByOrgDesc(input: $input) {
      branchs {
        id
        branchName
        region
      }
    }
  }
`;

const HitAndRunPoliceReportPage = ({
      data,
      branchId,
      userId,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);

  const { asPath } = useRouter();
  const { pathname } = useRouter();

  const handleAdd = () => {
    setShowAddModal((prev) => !prev);
  };

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
                {session.user.memberships.role === "TRAFFICPOLICEADMIN" && (
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
                {session.user.memberships.role === "TRAFFICPOLICEADMIN" && (
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
        <ListHitAndRun
          hitAndRunData={data.feedHitAndRunReportPolice}
          href={asPath}
        />
      </div>
      {showAddModal ? (
        <CreateHitAndRunModal
          branchData={data.feedBranchHead}
          branchId={branchId}
          userId={userId}
          href={pathname}
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
    query: FeedHitAndRunReportPolice,
    variables: {
      branchId: session.user.memberships.branchs.id,
      input: {
        description: "MINISTRY",
      },
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
      branchId: session.user.memberships.branchId,
      userId: session.user.id,
    },
  };
};

export default HitAndRunPoliceReportPage;
