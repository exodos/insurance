import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import ListClaim from "@/claim/list-claim";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";

const FeedClaimInsurer = gql`
  query FeedClaimInsurer(
    $orgId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [ClaimOrderByInput!]
  ) {
    feedClaimInsurer(
      orgId: $orgId
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
          insuredName
          mobileNumber
        }
        vehicles {
          id
          plateNumber
        }
        branchs {
          id
          branchName
          mobileNumber
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

const InsurerClaimPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Claim Page"}
        content={"Third Party Insurance Claim For Branch"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Claim</h1>
              <p className="text-base font-medium text-gray-50">
                List Of Claims
              </p>
            </div>
          </div>
        </div>
        <ListClaim claimData={data.feedClaimInsurer} href={asPath} />
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
    query: FeedClaimInsurer,
    variables: {
      orgId: session.user.memberships.branchs.orgId,
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

export default InsurerClaimPage;
