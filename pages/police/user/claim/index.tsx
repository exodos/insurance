import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { gql } from "@apollo/client";
import ListClaim from "@/claim/list-claim";
import { useRouter } from "next/router";
import { initializeApollo } from "lib/apollo";
import { authOptions } from "pages/api/auth/[...nextauth]";
import SiteHeader from "@/components/layout/header";
import { getServerSession } from "next-auth";

const FeedClaimPoliceBranch = gql`
  query FeedClaimPoliceBranch(
    $branchId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [ClaimOrderByInput!]
  ) {
    feedClaimPoliceBranch(
      branchId: $branchId
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      claim {
        id
        claimNumber
        damageEstimate
        claimedAt
        updatedAt
        insuredPoliceReports {
          id
          incidentNumber
        }
        insureds {
          id
          firstName
          lastName
          mobileNumber
        }
        vehicles {
          id
          plateNumber
        }
        branchs {
          id
          branchName
          region
        }
        certificates {
          id
          certificateNumber
        }
      }
      totalClaim
      maxPage
    }
  }
`;

const PoliceUserClaimPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Claim Page"}
        content={"Third Party Insurance Claim Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Claim</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Claims
              </p>
            </div>
          </div>
        </div>
        <ListClaim claimData={data.feedClaimPoliceBranch} href={asPath} />
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
    query: FeedClaimPoliceBranch,
    variables: {
      branchId: session.user.memberships.branchs.id,
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

export default PoliceUserClaimPage;
