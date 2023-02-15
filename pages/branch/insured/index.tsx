import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListInsured from "@/insured/list-insured";
import BranchAddInsuredModal from "@/insured/branch-create-insured";
import SiteHeader from "@/components/layout/header";
import { useRouter } from "next/router";
import Link from "next/link";

const FeedInsuredBranch = gql`
  query FeedInsuredBranch(
    $branchId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [InsuredOrderByInput!]
  ) {
    feedInsuredBranch(
      branchId: $branchId
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
    listAllBranch {
      id
      branchName
    }
  }
`;

const BranchInsuredPage = ({
  data,
  branchId,
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
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Insureds In The Branch
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {(session.user.memberships.role === "INSURER" ||
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
                {session.user.memberships.role === "MEMBER" && (
                  <Link
                    href={{
                      pathname: "/branch/insured/export-insured",
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
        <ListInsured insuredData={data.feedInsuredBranch} />
      </div>
      {showAddModal ? (
        <BranchAddInsuredModal branchId={branchId} href={pathname} />
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

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 20;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedInsuredBranch,
    variables: {
      branchId: session.user.memberships.branchs.id,
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
      branchId: session.user.memberships.branchs.id,
    },
  };
};

export default BranchInsuredPage;
