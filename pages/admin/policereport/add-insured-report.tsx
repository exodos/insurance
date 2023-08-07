import React from "react";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { gql } from "apollo-server-micro";
import { initializeApollo } from "lib/apollo";

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

const AdminInsuredPoliceReportAdd = ({
  data,
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
      {/* <InsuredPoliceReportCreate
        regionCode={data.regionCode}
        codeList={data.plateCode}
      /> */}
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

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: PlateCode,
  });

  //   console.log(data);

  return {
    props: {
      session,
      data,
    },
  };
};

export default AdminInsuredPoliceReportAdd;
