import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import ListInsuredPoliceReport from "@/policereport/insured/list-insured-police-report";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";
import Report from "@/components/report/fly-out";
import ReactTooltip from "react-tooltip";

const FeedInsuredPoliceReport = gql`
  query FeedInsuredPoliceReport(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [InsuredPoliceReportOrderByInput!]
  ) {
    feedInsuredPoliceReport(
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      insuredPoliceReports {
        id
        incidentNumber
        victimDriverName
        victimLicenceNumber
        victimLevel
        victimRegion
        victimCity
        victimSubCity
        victimWereda
        victimKebelle
        victimHouseNo
        victimPhoneNumber
        incidentCause
        incidentDate
        incidentPlace
        incidentTime
        responsibleDriverName
        responsiblePhoneNumber
        reportDate
        vehicle_PoliceReport_victimVehicle {
          id
          plateNumber
          insureds {
            id
            firstName
            mobileNumber
          }
        }
        branchs {
          id
          branchName
        }
        vehicle_PoliceReport_responsibleVehicle {
          id
          plateNumber
          insureds {
            id
            firstName
            mobileNumber
          }
        }
        policeBranch {
          id
          branchName
          region
        }
        trafficPolices {
          id
          firstName
          lastName
          mobileNumber
        }
      }
      totalInsuredPoliceReport
      maxPage
    }
  }
`;

const AdminInsuredPoliceReport = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { asPath } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Police Report For Insured Page"}
        content={"Third Party Insurance Police Report For Insured Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-14 sm:px-2 lg:px-20">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Police Report For Insured Vehicles
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Police Report For Insured Vehicles
              </p>
            </div>
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <Report />
              </div>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user?.memberships?.role === "SUPERADMIN" && (
                  <Link
                    href={{
                      pathname: "/admin/policereport/export-police-report",
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
                        data-for="exportInsuredPoliceReport"
                      >
                        <BsFillArrowUpCircleFill
                          className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                          aria-hidden="true"
                        />
                      </button>
                      <ReactTooltip
                        id="exportInsuredPoliceReport"
                        place="top"
                        effect="solid"
                      >
                        Export Insured Police Report
                      </ReactTooltip>
                    </>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <ListInsuredPoliceReport
          policeReportData={data.feedInsuredPoliceReport}
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
  } else if (session.user?.memberships?.role !== "SUPERADMIN") {
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
    query: FeedInsuredPoliceReport,
    variables: {
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          reportDate: "desc",
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

export default AdminInsuredPoliceReport;
