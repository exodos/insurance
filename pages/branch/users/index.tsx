import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListUser from "@/users/list-user";
import AddUserModalByBranch from "@/users/branch-add-user";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";

const FeedUserBranch = gql`
  query FeedUserBranch(
    $branchId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [UserOrderByInput!]
  ) {
    feedUserBranch(
      branchId: $branchId
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      user {
        id
        firstName
        lastName
        region
        city
        email
        mobileNumber
        password
        adminRestPassword
        createdAt
        updatedAt
        memberships {
          id
          role
          branchs {
            id
            branchName
          }
        }
      }
      totalUser
      maxPage
    }
    branchRoleList {
      id
      role
    }
  }
`;

const BranchUserPage = ({
      data,
      branchId,
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
        title={"Third Party Insurance Users Page"}
        content={"Third Party Insurance Users For Branch"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Users</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Users Of The Branch
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "MEMBER" && (
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
                {session.user.memberships.role === "INSURER" && (
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
        <ListUser
          userData={data.feedUserBranch}
          roleList={data.branchRoleList}
        />
      </div>
      {showAddModal ? (
        <AddUserModalByBranch
          branchId={branchId}
          roleList={data.branchRoleList}
          href={asPath}
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

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 20;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const branchId = session.user.memberships.branchId;
  // console.log(branchId);

  const { data } = await apolloClient.query({
    query: FeedUserBranch,
    variables: {
      branchId: branchId,
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
      branchId: branchId,
    },
  };
};

export default BranchUserPage;
