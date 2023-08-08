import { MdPassword } from "react-icons/md";
import Image from "next/image";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { gql } from "apollo-server-micro";
import { useMutation } from "@apollo/client";
import NotificationContext from "@/store/notification-context";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth";
import { initializeApollo } from "@/lib/apollo";
import { verifyPassword } from "@/lib/auth";

const ChangeUserPassword = gql`
  mutation ChangeUserPassword(
    $changeUserPasswordId: String!
    $currentPassword: String!
    $password: String!
  ) {
    changeUserPassword(
      id: $changeUserPasswordId
      currentPassword: $currentPassword
      password: $password
    ) {
      id
    }
  }
`;

const UsersByID = gql`
  query UsersByID($userId: String!) {
    usersByID(userId: $userId) {
      id
      password
    }
  }
`;

const ForceResetPassword = ({
  data,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [userPassword, setUserPassword] = useState(data.usersByID.password);
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);

  const [changeUserPassword] = useMutation(ChangeUserPassword);

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validate = Yup.object().shape({
    currentPassword: Yup.string()
      .required("Please Enter Old Password")
      .test("isOldPasswordValid", "OldPassword Incorrect", function (value) {
        if (!value) return true;
        return verifyPassword(value, userPassword);
      }),
    newPassword: Yup.string()
      .required("Please Enter New Password")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .notOneOf(
        [Yup.ref("currentPassword"), null],
        "Old Password and new password must be different"
      ),
    confirmPassword: Yup.string()
      .required("Please Enter Confirm Password")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const [formValues, setFormValues] = useState(null);

  const onSubmit = async (values: any) => {
    await changeUserPassword({
      variables: {
        changeUserPasswordId: userId,
        currentPassword: values.currentPassword,
        password: values.newPassword,
      },
      onError: (error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      },
      onCompleted: (data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: data.message || "Successfully Reset User Password",
          status: "success",
        });
        signOut();
      },

      //   update: (cache, { data }) => {
      //     const cacheId = cache.identify(data.message);
      //     cache.modify({
      //       fields: {
      //         messages: (existinFieldData, { toReference }) => {
      //           return [...existinFieldData, toReference(cacheId)];
      //         },
      //       },
      //     });
      //   },
    }).then(() => router.push("/"));
  };
  return (
    <>
      <Head>
        <title>Change User Password</title>
        <meta name="description" content="Fuel Subsidary Add User" />
      </Head>
      <div className="h-screen">
        <div className="flex h-screen">
          <div className="relative hidden lg:block bg-lightGreen lg:w-3/4 ">
            <div className="mt-28 pt-10 mx-40 w-full">
              <Image
                src={"/new-logos/3rd-party-insurance-logo.png"}
                alt="Insurance Pic"
                className="h-500 w-auto object-cover"
                width={750}
                height={350}
                priority
              />
            </div>
          </div>
          <div className="flex py-10 px-10 sm:px-8 lg:flex-none lg:px-40 xl:px-44">
            <div className="mx-auto w-full max-w-lg">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-initial">
                  <Image
                    className="h-36 w-auto"
                    src={"/logos/ethio-logo.svg"}
                    alt="Ethiotelecom logo"
                    width={350}
                    height={120}
                  />
                </div>
                <div className="sm:flex-auto">
                  <Image
                    className="h-28 w-auto"
                    src={"/logos/telebirr-logo.svg"}
                    alt="TeleBirr logo"
                    width={350}
                    height={120}
                  />
                </div>
              </div>
              <div className="mt-20">
                <div className="mt-1 pb-10">
                  <h1 className="text-deepGreen font-bold text-3xl">
                    You Must Change Your Password
                  </h1>
                </div>
              </div>

              <div className="mt-10">
                <Formik
                  initialValues={formValues || initialValues}
                  validationSchema={validate}
                  onSubmit={onSubmit}
                  enableReinitialize={true}
                >
                  <Form className="space-y-0">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="hidden text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MdPassword
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <Field
                          name="currentPassword"
                          type="password"
                          className="block w-full rounded-md  border-gray-50 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                          placeholder="Enter Current Password"
                        />
                        <div className="text-red-600  text-sm italic mt-1">
                          <ErrorMessage name="currentPassword" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="newPassword"
                        className="hidden text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <RiLockPasswordLine
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <Field
                          name="newPassword"
                          type="password"
                          className="block w-full rounded-md  border-gray-50 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                          placeholder="New Password"
                        />
                        <div className="text-red-600  text-sm italic mt-1">
                          <ErrorMessage name="newPassword" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="confirmPassword"
                        className="hidden text-sm font-medium text-gray-700"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <RiLockPasswordLine
                            className="h-6 w-6 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <Field
                          name="confirmPassword"
                          type="password"
                          className="block w-full rounded-md  border-gray-50 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                          placeholder="Confirm Password"
                        />
                        <div className="text-red-600  text-sm italic mt-1">
                          <ErrorMessage name="confirmPassword" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-lg border border-transparent bg-lightGreen py-3 px-2 text-base font-semibold text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-darkGrayHv focus:ring-offset-2"
                      >
                        Reset
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
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
  //   else if (!session.user.adminRestPassword) {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   }

  const userId = session.user.id;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: UsersByID,
    variables: {
      userId,
    },
  });

  return {
    props: {
      session,
      data,
      userId: userId,
    },
  };
};

export default ForceResetPassword;
