import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import SiteHeader from "../components/layout/header";

const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // const { data: session, status } = useSession();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Admin Dashboard Page"}
        content={"Third Party Insurance Admin Dashboard Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Admin Dashboard
              </h1>
            </div>
          </div>
        </div>
        {/* <ListCertificate certificateData={data.feedCertificate} /> */}
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
  } else if (session?.user?.adminRestPassword) {
    return {
      redirect: {
        destination: "/auth/force-reset",
        permanent: false,
      },
    };
  } else if (session?.user.memberships.role === "INSURER") {
    return {
      redirect: {
        permanent: false,
        destination: "/insurer",
      },
    };
  } else if (session?.user.memberships.role === "MEMBER") {
    return {
      redirect: {
        permanent: false,
        destination: "/branch",
      },
    };
  } else if (session?.user.memberships.role === "TRAFFICPOLICEADMIN") {
    return {
      redirect: {
        permanent: false,
        destination: "/police",
      },
    };
  } else if (session?.user.memberships.role === "TRAFFICPOLICEMEMBER") {
    return {
      redirect: {
        permanent: false,
        destination: "/police/user",
      },
    };
  }

  // console.log(session.user.memberships.role);

  return {
    props: {
      session,
    },
  };
};

export default Home;
