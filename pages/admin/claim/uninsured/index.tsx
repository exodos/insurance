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
import Link from "next/link";
import Report from "@/components/report/fly-out";
import ReactTooltip from "react-tooltip";

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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-14 sm:px-2 lg:px-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Claim For UnInsured
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Claims For UnInsured Vehicles
              </p>
            </div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <Report />
              </div>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session?.user?.memberships?.role === "SUPERADMIN" && (
                  <Link
                    href={{
                      pathname: "/admin/claim/uninsured/export-uninsured-claim",
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
                        data-for="exportUnInsuredClaim"
                      >
                        <BsFillArrowUpCircleFill
                          className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                          aria-hidden="true"
                        />
                      </button>
                      <ReactTooltip
                        id="exportUnInsuredClaim"
                        place="top"
                        effect="solid"
                      >
                        Export UnInsured Claim
                      </ReactTooltip>
                    </>
                  </Link>
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
  } else if (session?.user?.memberships?.role !== "SUPERADMIN") {
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
