import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { changePhone } from "lib/config";
import { FormContext } from "@/pages/branch/certificate/proposal-create-insurance";

const ProposalCreateInsured = () => {
  const { activeStepIndex, setActiveStepIndex, formData, setFormData } =
    useContext(FormContext);

  const renderError = (message) => (
    <p className="italic text-red-600">{message}</p>
  );
  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;

  const initialValues = {
    firstName: "",
    lastName: "",
    occupation: "",
    region: "",
    city: "",
    subCity: "",
    wereda: "",
    kebelle: "",
    houseNumber: "",
    mobileNumber: "",
    // branchName: "",
  };

  const validate = Yup.object().shape({
    firstName: Yup.string().required("First Name Is Required"),
    lastName: Yup.string().required("First Name Is Required"),
    region: Yup.string().required("Region Is Required"),
    city: Yup.string().required("City Is Required"),
    subCity: Yup.string().required("SubCity Name Is Required"),
    wereda: Yup.string().required("Wereda Is Required"),
    kebelle: Yup.string().required("Kebelle Is Required"),
    houseNumber: Yup.string().required("HouseNumber Is Required"),
    mobileNumber: Yup.string()
      .matches(phoneRegExp, "Phone Number Is Not Valid")
      .required("Phone Number Is Required"),
    // branchName: Yup.string().required("Branch Name Is Required"),
  });

  return (
    <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
      <h1 className="text-lg font-semibold text-gray-700 pt-5">
        Create Insured
      </h1>
      <p className="text-base font-medium text-gray-500">
        Please enter detail for the insured
      </p>
      <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
        <div className="container px-2 py-5 mx-auto">
          <Formik
            initialValues={initialValues}
            validationSchema={validate}
            onSubmit={(values) => {
              const data = { ...formData, ...values };
              setFormData(data);
              setActiveStepIndex(activeStepIndex + 1);
            }}
          >
            <Form className="space-y-6 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5"></div>
              <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="mt-5 md:mt-0 md:col-span-3">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          First Name
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="firstName"
                          placeholder="Enter First Name"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="firstName" render={renderError} />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Last Name
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="lastName"
                          placeholder="Enter Last Name"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="lastName" render={renderError} />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="occupation"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Occupation
                        </label>
                        <Field
                          type="text"
                          name="occupation"
                          placeholder="Enter occupation"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="region"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Region <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="region"
                          placeholder="Enter Region"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="region" render={renderError} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="mt-5 md:mt-0 md:col-span-3">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          City <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="city"
                          placeholder="Enter City"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="city" render={renderError} />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="subCity"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          SubCity <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="subCity"
                          placeholder="Enter SubCity"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="subCity" render={renderError} />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="wereda"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Wereda <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="wereda"
                          placeholder="Enter Wereda"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="wereda" render={renderError} />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="kebelle"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Kebelle <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="kebelle"
                          placeholder="Enter Kebele"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="kebelle" render={renderError} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="mt-5 md:mt-0 md:col-span-3">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="houseNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          House Number <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="houseNumber"
                          placeholder="Enter House Number"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="houseNumber"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="mobileNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Mobile Number
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="mobileNumber"
                          placeholder="Enter Mobile Number"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="mobileNumber"
                            render={renderError}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex justify-center">
                  <button
                    className="rounded-md border border-gray-300 bg-lightGreen ml-5 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-lightBlue focus:ring-offset-2"
                    type="submit"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProposalCreateInsured;
