import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsFillArrowUpCircleFill, BsPlusCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import ListBranchs from "@/branchs/list-branchs";
import Link from "next/link";
import { useState } from "react";
import AdminAddBranch from "@/components/branchs/add-branchs";

const FeedBranch = gql`
  query FeedBranch(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [BranchOrderByInput!]
  ) {
    feedBranch(filter: $filter, skip: $skip, take: $take, orderBy: $orderBy) {
      branchs {
        id
        branchName
        branchCode
        region
        city
        mobileNumber
        createdAt
        updatedAt
      }
      totalBranch
      maxPage
    }
  }
`;
const ListAllOrganization = gql`
  query ListAllOrganization {
    listAllOrganization {
      id
      orgName
    }
  }
`;

const AdminBranchPage = ({
  data,
  ListOrg,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const { asPath } = useRouter();

  const handleAdd = () => {
    setShowAddModal((prev) => !prev);
  };

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Branch Page"}
        content={"Third Party Insurance Branch Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Branch</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Branchs
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <>
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
                    <Link
                      href={{
                        pathname: "/admin/branchs/export-branchs",
                        query: {
                          returnPage: asPath,
                        },
                      }}
                      passHref
                      legacyBehavior
                    >
                      <button
                        type="button"
                        className="inline-flex items-center"
                      >
                        <BsFillArrowUpCircleFill
                          className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                          aria-hidden="true"
                        />
                      </button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <ListBranchs branchData={data.feedBranch} href={asPath} />
      </div>

      {showAddModal ? (
        <AdminAddBranch orgData={ListOrg?.listAllOrganization} />
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
    query: FeedBranch,
    variables: {
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

  const { data: ListOrg } = await apolloClient.query({
    query: ListAllOrganization,
  });

  return {
    props: {
      session,
      data,
      ListOrg,
    },
  };
};

export default AdminBranchPage;
