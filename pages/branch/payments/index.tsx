import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";
import ListPayment from "@/components/payments/list-payment";

const FeedPaymentBranchByStatus = gql`
  query FeedPaymentBranchByStatus(
    $input: PaymentStatusInput!
    $branchId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [PaymentOrderByInput!]
  ) {
    feedPaymentBranchByStatus(
      input: $input
      branchId: $branchId
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      payments {
        id
        refNumber
        premiumTarif
        paymentStatus
        commissionStatus
        deletedStatus
        deletedAt
        createdAt
        updatedAt
        insureds {
          id
          regNumber
          mobileNumber
        }
        branchs {
          id
          branchName
          branchCode
        }
      }
      totalPayments
      maxPage
    }
  }
`;

const BranchPayedPaymentPage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Page"}
        content={"Third Party Insurance Payed Payment Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Payment</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Payed Payment
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session?.user?.memberships?.role === "BRANCHADMIN" && (
                  <Link
                    href={{
                      pathname: "/branch/payments/branch-export-payment",
                      query: {
                        paymentStatus: "Payed",
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
        <ListPayment
          paymentData={data.feedPaymentBranchByStatus}
          href={asPath}
        />
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
  } else if (
    session?.user?.memberships?.role !== "BRANCHADMIN" &&
    session?.user?.memberships?.role !== "MEMBER" &&
    session?.user?.memberships?.role !== "USER"
  ) {
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
    query: FeedPaymentBranchByStatus,
    variables: {
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
      input: {
        paymentStatus: "Payed",
      },
      branchId: session.user.memberships.branchs.id,
    },
  });

  return {
    props: {
      session,
      data,
    },
  };
};

export default BranchPayedPaymentPage;
