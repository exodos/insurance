import { MdEmail } from "react-icons/md";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { CtxOrReq } from "next-auth/client/_utils";
import SignInError from "./signin-error";
import SiteHeader from "@/components/layout/header";

const SignIn = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const validate = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string().required("Password Is Required"),
  });
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance | Login Page"}
        content={"Third Party Insurance | Login Page"}
      />
      <div className="h-screen">
        <div className="flex h-screen">
          <div className="relative hidden lg:block bg-lightGreen lg:w-2/4 ">
            <div className="mt-32 pt-20 px-20 items-center justify-center">
              <Image
                src={"/new-logos/3rd-party-insurance-logo.png"}
                alt="Third Party Insurance Pic"
                className="h-200 w-auto"
                width={750}
                height={250}
                priority
              />
            </div>
          </div>
          <div className="relative lg:w-2/4">
            <div className="mt-10">
              <div className="sm:flex sm:ml-5 sm:items-center">
                <div className="sm:flex-initial sm:ml-8 ml-8">
                  <Image
                    className="h-20 w-auto"
                    src={"/logos/ethio-logo.svg"}
                    alt="Ethiotelecom logo"
                    width={350}
                    height={120}
                  />
                </div>
                <div className="sm:flex-auto">
                  {/* <Image
                    className="h-20 w-auto"
                    src={"/logos/ethio-logo.svg"}
                    alt="Ethiotelecom logo"
                    width={350}
                    height={120}
                  /> */}
                </div>
                <div className="sm:mt-0 sm:mr-8 ml-12 sm:flex-none">
                  <Image
                    className="h-16 w-auto"
                    src={"/logos/telebirr-logo.svg"}
                    alt="TeleBirr logo"
                    width={350}
                    height={120}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center py-10 px-10 sm:px-6 lg:px-8 lg:flex-none">
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md justify-center items-center">
              <div className="bg-white px-10 py-8 shadow sm:rounded-lg sm:px-10">
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={validate}
                  onSubmit={async (values, { setSubmitting }) => {
                    const res = await signIn("credentials", {
                      redirect: false,
                      email: values.email,
                      password: values.password,
                      callbackUrl: `${window.location.origin}`,
                    });

                    if (res?.error) {
                      setError(res.error);
                    } else {
                      setError(null);
                    }
                    if (res.url) router.push(res.url);
                    setSubmitting(false);
                  }}
                >
                  {(formik) => (
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="hidden text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MdEmail
                              className="h-6 w-6 text-lightGreen"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md border-gray-300 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                            placeholder="Email Address"
                          />
                          <div className="text-red-600  text-sm italic mt-1">
                            <ErrorMessage name="email" />
                          </div>
                        </div>
                      </div>
                      {/* <div className="space-y-3"> */}

                      <div>
                        <label
                          htmlFor="password"
                          className="hidden text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <RiLockPasswordFill
                              className="h-6 w-6 text-lightGreen"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            className="block w-full rounded-md  border-gray-50 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                            placeholder="Password"
                          />
                          <div className="text-red-600  text-sm italic mt-1">
                            <ErrorMessage name="password" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <input
                          name="csrfToken"
                          type="hidden"
                          defaultValue={csrfToken}
                        />
                        <div className="text-red-400 text-md text-center rounded p-1">
                          {error && <SignInError error={error} />}
                        </div>
                      </div>
                      <div className="pt-4">
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-3xl border border-transparent bg-lightGreen py-3 px-2 text-base font-semibold text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-darkGrayHv focus:ring-offset-2"
                        >
                          {formik.isSubmitting ? "Please wait..." : "Sign In"}
                        </button>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: CtxOrReq) => {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default SignIn;
