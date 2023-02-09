import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SessionProvider } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import ListInsuredPoliceReport from "@/policereport/insured/list-insured-police-report";
import SiteHeader from "@/components/layout/header";
import { getServerSession } from "next-auth";

const FeedInsuredPoliceReportInsurer = gql`
  query FeedInsuredPoliceReportInsurer(
    $orgId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [InsuredPoliceReportOrderByInput!]
  ) {
    feedInsuredPoliceReportInsurer(
      orgId: $orgId
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
          city
          mobileNumber
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

const InsurerPoliceReportPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Police Report Page"}
        content={"Third Party Insurance Police Report For Branch"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Police Report
              </h1>
              <p className="text-base font-medium text-gray-50">
                List Of All Police Report
              </p>
            </div>
          </div>
        </div>
        <ListInsuredPoliceReport
          policeReportData={data.feedInsuredPoliceReportInsurer}
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
    query: FeedInsuredPoliceReportInsurer,
    variables: {
      orgId: session.user.memberships.branchs.orgId,
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
      data,
    },
  };
};

export default InsurerPoliceReportPage;
