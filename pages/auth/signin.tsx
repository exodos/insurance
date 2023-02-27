import { MdEmail } from "react-icons/md";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { RiLockPasswordLine } from "react-icons/ri";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { CtxOrReq } from "next-auth/client/_utils";
import SignInError from "./signin-error";

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
                    Third Party Insurance System
                  </h1>
                </div>
              </div>

              <div className="mt-10">
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
                    <form onSubmit={formik.handleSubmit} className="space-y-0">
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
                              className="h-6 w-6 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md  border-gray-300 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                            // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"

                            placeholder="Email Address"
                          />
                          <div className="text-red-600  text-sm italic mt-1">
                            <ErrorMessage name="email" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor="password"
                          className="hidden text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <RiLockPasswordLine
                              className="h-6 w-6 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <Field
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            className="block w-full rounded-md  border-gray-300 p-4 pl-10 focus:shadow-xl focus:border-darkGrayHv ring-1 ring-gray-400 sm:text-sm"
                            placeholder="Passwords"
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
                        <div className="text-red-400 text-md text-center rounded p-2">
                          {/* {error} */}
                          {error && <SignInError error={error} />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center"></div>

                        {/* <div className="text-sm">
                          <a
                            href="#"
                            className="font-semibold text-lightGreen hover:text-deepGreen"
                          >
                            Forgot your password?
                          </a>
                        </div> */}
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="flex w-full justify-center rounded-lg border border-transparent bg-lightGreen py-3 px-2 text-base font-semibold text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-darkGrayHv focus:ring-offset-2"
                        >
                          {/* Sign in */}
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
