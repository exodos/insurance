import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../../api/auth/[...nextauth]";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import ListUnInsuredClaim from "@/claim/uninsured/list-uninsured-claim";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";

const FeedClaimUnInsured = gql`
  query FeedClaimUnInsured(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [ClaimOrderByInput!]
  ) {
    feedClaimUnInsured(
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      claimUnInsured {
        id
        claimNumber
        damageEstimate
        vehiclePlateNumber
        claimedAt
        updatedAt
        unInsuredPoliceReports {
          incidentNumber
        }
        branchs {
          branchName
        }
      }
      totalClaimUnInsured
      maxPage
    }
  }
`;

const AdminClaimUnInsured = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Claim For UnInsured Page"}
        content={"Third Party Insurance Claim For UnInsured Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Claim For UnInsured
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Claims For UnInsured Vehicles
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <button type="button" className="inline-flex items-center">
                    <BsFillArrowUpCircleFill
                      className="flex-shrink-0 mr-5 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-200"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <ListUnInsuredClaim claimData={data.feedClaimUnInsured} href={asPath} />
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
    query: FeedClaimUnInsured,
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
      take: take,
      skip: skip,
      data,
    },
  };
};

export default AdminClaimUnInsured;
