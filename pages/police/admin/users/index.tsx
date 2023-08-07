import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { gql } from "@apollo/client";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import PoliceListUser from "@/users/police-list-user";
import AddUserModal from "@/users/add-user";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { initializeApollo } from "@/lib/apollo";

const FeedUserInsurer = gql`
  query FeedUserInsurer(
    $orgId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [UserOrderByInput!]
    $input: orgDescInput!
  ) {
    feedUserInsurer(
      orgId: $orgId
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
            organizations {
              id
              orgName
            }
          }
        }
      }
      totalUser
      maxPage
    }
    policeRoleList {
      id
      role
    }
    feedBranchByOrgDesc(input: $input) {
      branchs {
        id
        branchName
      }
    }
  }
`;

const PoliceUserPage = ({
  data,
  orgId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);

  const { pathname } = useRouter();

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
                List Of All Users
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session?.user?.memberships?.role === "TRAFFICPOLICEADMIN" && (
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
                {session?.user?.memberships?.role === "TRAFFICPOLICEADMIN" && (
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
        <PoliceListUser
          userData={data.feedUserInsurer}
          roleList={data.policeRoleList}
          href={pathname}
        />
      </div>
      {showAddModal ? (
        <AddUserModal
          branchData={data.feedBranchByOrgDesc.branchs}
          roleList={data.policeRoleList}
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
  } else if (session?.user?.memberships?.role !== "TRAFFICPOLICEADMIN") {
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
    query: FeedUserInsurer,
    variables: {
      input: {
        description: "TRAFFICPOLICE",
      },
      orgId: session.user.memberships.branchs.orgId,
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
      orgId: session.user.memberships.branchs.orgId,
    },
  };
};

export default PoliceUserPage;
