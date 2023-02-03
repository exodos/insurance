import React from "react";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SessionProvider } from "next-auth/react";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { gql } from "apollo-server-micro";
import { initializeApollo } from "lib/apollo";
import CreateInsuredPoliceReportPage from "@/policereport/insured/insured-create-report";

const PlateCode = gql`
  query PlateCode {
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

const AddPoliceReport = ({
      data,
      userId,
      branchId,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Add Police Report</title>
        <meta
          name="description"
          content="Third Party Insurance Add Police Report"
        />
      </Head>
      <CreateInsuredPoliceReportPage
        plateCode={data.plateCode}
        regionCode={data.regionCode}
        userId={userId}
        branchId={branchId}
        href={"/police-admin/policereport"}
      />
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
  } else if (session.user.adminRestPassword) {
    return {
      redirect: {
        destination: "/user/force-reset",
        permanent: false,
      },
    };
  }

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: PlateCode,
  });

  return {
    props: {
      session,
      data,
      userId: session?.user?.id,
      branchId: session.user.memberships.branchId,
    },
  };
};

export default AddPoliceReport;
