import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import SiteHeader from "../components/layout/header";
import Image from "next/image";
import Link from "next/link";

export default function AccessDeniedPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Admin Dashboard Page"}
        content={"Third Party Insurance Admin Dashboard Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
          <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
            <div className="relative">
              <div className="absolute">
                <div className="">
                  <h1 className="my-2 text-gray-800 font-bold text-2xl">
                    Looks like you are not authorized to view that page
                  </h1>
                  <p className="my-2 text-gray-800">
                    Sorry about that! Please visit our hompage to get where you
                    need to go.
                  </p>
                  <Link href={"/"} passHref legacyBehavior>
                    <button className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
                      Take me there!
                    </button>
                  </Link>
                </div>
              </div>
              <div>
                <Image src={"/404-2.png"} alt="" width={1000} height={1000} />
              </div>
            </div>
          </div>
          <div>
            <Image src={"/Group.png"} alt="" width={1000} height={1000} />
          </div>
        </div>
      </div>
    </>
  );
}

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
  }

  return {
    props: {
      session,
    },
  };
};
