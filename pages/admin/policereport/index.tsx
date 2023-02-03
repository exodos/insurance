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
            insuredName
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
            insuredName
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
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Police Report For Insured
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Police Report For InSureds
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
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
  } else if (session.user.memberships.role !== "SUPERADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // console.log(session.user);

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 20;

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