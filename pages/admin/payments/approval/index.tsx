import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { gql } from "@apollo/client";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { initializeApollo } from "@/lib/apollo";
import ListPendingApprovalPayment from "@/components/payments/list-pending-approval";
import Report from "@/components/report/fly-out";
import ReactTooltip from "react-tooltip";

const FeedPaymentByStatus = gql`
  query FeedPaymentByStatus(
    $input: PaymentStatusInput!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [PaymentOrderByInput!]
  ) {
    feedPaymentByStatus(
      input: $input
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
          branchName
          branchCode
        }
      }
      totalPayments
      maxPage
    }
  }
`;

const AdminPendingApprovalPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Pending Approval Page"}
        content={"Third Party Insurance Pending Approval Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-14 sm:px-2 lg:px-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">Payment</h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Pending Approval
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
                      pathname: "/admin/payments/export-payment",
                      query: {
                        paymentStatus: "PendingApproval",
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
                        data-for="exportPendingApproval"
                      >
                        <BsFillArrowUpCircleFill
                          className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                          aria-hidden="true"
                        />
                      </button>
                      <ReactTooltip
                        id="exportPendingApproval"
                        place="top"
                        effect="solid"
                      >
                        Export Pending Approval
                      </ReactTooltip>
                    </>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <ListPendingApprovalPayment
          paymentData={data.feedPaymentByStatus}
          href={"/admin/payments"}
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
    query: FeedPaymentByStatus,
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
        paymentStatus: "PendingApproval",
      },
    },
  });

  return {
    props: {
      session,
      data,
    },
  };
};

export default AdminPendingApprovalPage;
