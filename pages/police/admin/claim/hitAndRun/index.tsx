import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { gql } from "@apollo/client";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import ListHitAndRunClaim from "@/claim/hitrunclaim/list-hit-and-run";
import { useRouter } from "next/router";
import { initializeApollo } from "lib/apollo";
import { authOptions } from "pages/api/auth/[...nextauth]";
import SiteHeader from "@/components/layout/header";

const FeedClaimHitAndRun = gql`
  query FeedClaimHitAndRun(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [ClaimOrderByInput!]
  ) {
    feedClaimHitAndRun(
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      claimHitAndRuns {
        id
        claimNumber
        damageEstimate
        claimedAt
        claimerFullName
        claimerRegion
        claimerCity
        claimerPhoneNumber
        updatedAt
        hitAndRunPoliceReports {
          incidentNumber
        }
        branchs {
          branchName
          region
        }
      }
      totalClaimHitAndRun
      maxPage
    }
  }
`;

const PoliceHitAndRunClaim = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Hit And Run Claim Page"}
        content={"Third Party Insurance Hit And Run Claim Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Hit And Run Claim
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Hit And Run Claims
              </p>
            </div>
            {session?.user &&
              session?.user?.memberships.role === "TRAFFICPOLICEADMIN" && (
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <button type="button" className="inline-flex items-center">
                    <BsFillArrowUpCircleFill
                      className="flex-shrink-0 mr-5 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-200"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )}
          </div>
        </div>
        <ListHitAndRunClaim
          hitAndRunClaimData={data.feedClaimHitAndRun}
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
    query: FeedClaimHitAndRun,
    variables: {
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          claimedAt: "desc",
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

export default PoliceHitAndRunClaim;
