import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListUser from "@/users/list-user";
import AddUserModal from "@/users/add-user";
import { useRouter } from "next/router";
import SiteHeader from "@/layout/header";
import Link from "next/link";
import Report from "@/report/fly-out";
import ReactTooltip from "react-tooltip";

const FeedUser = gql`
  query FeedUser(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [UserOrderByInput!]
  ) {
    feedUser(filter: $filter, skip: $skip, take: $take, orderBy: $orderBy) {
      user {
        id
        firstName
        lastName
        region
        city
        email
        mobileNumber
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
  }
`;

const FeedRoleBranch = gql`
  query RoleList {
    roleList {
      id
      role
    }
    listAllBranch {
      id
      branchName
    }
  }
`;

const AdminUserPage = ({
      userData,
      roleBranchData,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);

  const { asPath, pathname } = useRouter();

  const handleAdd = () => {
    setShowAddModal((prev) => !prev);
  };
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Users Page"}
        content={"Third Party Insurance Users Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-14 sm:px-2 lg:px-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Users</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Users
              </p>
            </div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <Report />
              </div>
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
                        pathname: "/admin/users/export-user",
                        query: {
                          returnPage: asPath,
                        },
                      }}
                      passHref
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
        <ListUser
          userData={userData.feedUser}
          roleList={roleBranchData.roleList}
        />
      </div>
      {showAddModal ? (
        <AddUserModal
          branchData={roleBranchData.listAllBranch}
          roleList={roleBranchData.roleList}
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
        destination: "/auth/sign-in",
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

  const { data: userData } = await apolloClient.query({
    query: FeedUser,
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

  const { data: roleBranchData } = await apolloClient.query({
    query: FeedRoleBranch,
  });

  return {
    props: {
      session,
      userData,
      roleBranchData,
    },
  };
};

export default AdminUserPage;
