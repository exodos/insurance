import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListInsured from "@/insured/list-insured";
import AddInsuredModal from "@/insured/create-insured";
import SiteHeader from "@/components/layout/header";
import { useRouter } from "next/router";
import Link from "next/link";

const FeedInsuredInsurer = gql`
  query FeedInsuredInsurer(
    $orgId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [InsuredOrderByInput!]
    $feedBranchByOrgOrgId2: String!
  ) {
    feedInsuredInsurer(
      orgId: $orgId
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      insured {
        id
        regNumber
        firstName
        lastName
        occupation
        region
        city
        subCity
        wereda
        kebelle
        houseNumber
        mobileNumber
        createdAt
        updatedAt
      }
      totalInsured
      maxPage
    }
    feedBranchByOrg(orgId: $feedBranchByOrgOrgId2) {
      branchs {
        id
        branchName
      }
    }
  }
`;

const InsurerInsuredPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);

  const { pathname, asPath } = useRouter();
  const handleAdd = () => {
    setShowAddModal((prev) => !prev);
  };
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Insured Page"}
        content={"Third Party Insurance Insured For Branch"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Insured</h1>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {(session.user?.memberships?.role === "INSURER" ||
                  session?.user?.memberships?.role === "MEMBER") && (
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
                {session.user?.memberships?.role === "INSURER" && (
                  <Link
                    href={{
                      pathname: "/insurer/insured/export-insured",
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
        <ListInsured insuredData={data.feedInsuredInsurer} />
      </div>
      {showAddModal ? (
        <AddInsuredModal
          branchData={data.feedBranchByOrg.branchs}
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
  } else if (session?.user?.memberships?.role !== "INSURER") {
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
    query: FeedInsuredInsurer,
    variables: {
      orgId: session.user.memberships.branchs.orgId,
      feedBranchByOrgOrgId2: session.user.memberships.branchs.orgId,
      input: {
        description: "INSURANCE",
      },
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

export default InsurerInsuredPage;
