import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import {
  BsPlusCircleFill,
  BsFillArrowUpCircleFill,
  BsFillArrowDownCircleFill,
} from "react-icons/bs";
import { useState } from "react";
import ListCertificate from "@/certificate/list-certificate";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactTooltip from "react-tooltip";
import { MdCreate } from "react-icons/md";

const FeedCertificateInsurer = gql`
  query FeedCertificateInsurer(
    $orgId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [CertificateOrderByInput!]
  ) {
    feedCertificateInsurer(
      orgId: $orgId
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      certificate {
        id
        certificateNumber
        issuedDate
        premiumTarif
        updatedAt
        policies {
          id
          policyNumber
          policyStartDate
          policyExpireDate
          policyIssuedConditions
          personsEntitledToUse
        }
        vehicles {
          id
          plateNumber
        }
      }
      totalCertificate
      maxPage
    }
    plateCode {
      id
      code
    }
    regionCode {
      id
      regionApp
    }
  }
`;

const InsurerCertificatePage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { pathname } = useRouter();
  // console.log(pathname);
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Certificate By Branch Page"}
        content={"Third Party Insurance Certificate By Branch"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Certificate
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Certificates
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "INSURER" && (
                  <>
                    <Link
                      href={{
                        pathname:
                          "/branch/certificate/proposal-create-insurance",
                        query: {
                          returnPage: pathname,
                        },
                      }}
                    >
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center"
                          data-tip
                          data-type="light"
                          data-for="createInsurance"
                        >
                          <MdCreate
                            className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                            aria-hidden="true"
                          />
                        </button>
                        <ReactTooltip
                          id="createInsurance"
                          place="top"
                          effect="solid"
                        >
                          Create Insurance
                        </ReactTooltip>
                      </>
                    </Link>
                    <Link
                      href={{
                        pathname: "/branch/certificate/add-certificate",
                        query: {
                          returnPage: pathname,
                        },
                      }}
                    >
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center"
                          data-tip
                          data-type="light"
                          data-for="addInsurance"
                        >
                          <BsPlusCircleFill
                            className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                            aria-hidden="true"
                          />
                        </button>
                        <ReactTooltip
                          id="addInsurance"
                          place="top"
                          effect="solid"
                        >
                          Add Insurance
                        </ReactTooltip>
                      </>
                    </Link>
                    <Link
                      href={{
                        pathname: "/branch/certificate/import-by-insureds",
                        query: {
                          returnPage: pathname,
                        },
                      }}
                    >
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center"
                          data-tip
                          data-type="light"
                          data-for="importInsurance"
                        >
                          <BsFillArrowDownCircleFill
                            className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                            aria-hidden="true"
                          />
                        </button>
                        <ReactTooltip
                          id="importInsurance"
                          place="top"
                          effect="solid"
                        >
                          Import Insurance
                        </ReactTooltip>
                      </>
                    </Link>
                    <Link
                      href={{
                        pathname: "/branch/certificate/export-certificate",
                        query: {
                          returnPage: pathname,
                        },
                      }}
                    >
                      <>
                        <button
                          type="button"
                          className="inline-flex items-center"
                          data-tip
                          data-type="light"
                          data-for="exportToExcel"
                        >
                          <BsFillArrowUpCircleFill
                            className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                            aria-hidden="true"
                          />
                        </button>
                        <ReactTooltip
                          id="exportToExcel"
                          place="top"
                          effect="solid"
                        >
                          Export To Excel
                        </ReactTooltip>
                      </>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <ListCertificate certificateData={data.feedCertificateInsurer} />
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
    query: FeedCertificateInsurer,
    variables: {
      orgId: session.user.memberships.branchs.orgId,
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          issuedDate: "desc",
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

export default InsurerCertificatePage;
