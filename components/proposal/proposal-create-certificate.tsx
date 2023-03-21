import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormContext } from "@/pages/branch/certificate/proposal-create-insurance";

const ProposalCreateCertificate = () => {
  const { activeStepIndex, setActiveStepIndex, formData, setFormData } =
    useContext(FormContext);

  const renderError = (message) => (
    <p className="italic text-red-600">{message}</p>
  );

  const initialValues = {
    policyStartDate: "",
    policyIssuedConditions: "",
    personsEntitledToUse: "",
  };

  const validate = Yup.object().shape({
    policyStartDate: Yup.date().required("Policy Start Date Is Required"),
    policyIssuedConditions: Yup.string().required(
      "Policy Issued Conditions Is Required"
    ),
    personsEntitledToUse: Yup.string().required(
      "Persons Entitled To Use/Drive Is Required"
    ),
  });

  return (
    <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
      <h1 className="text-lg font-semibold text-gray-700 pt-5">
        Create Insurance
      </h1>
      <p className="text-base font-medium text-gray-500">
        Please enter detail for the insurance
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
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-3 sm:col-span-1">
                        <label
                          htmlFor="policyStartDate"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Policy Start Date
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="date"
                          name="policyStartDate"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="policyStartDate"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-1">
                        <label
                          htmlFor="policyIssuedConditions"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Policy Issued Conditions
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="policyIssuedConditions"
                          placeholder="Enter Policy Issued Conditions"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="policyIssuedConditions"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="personsEntitledToUse"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Persons Entitled To Use/Drive
                        </label>
                        <Field
                          type="text"
                          name="personsEntitledToUse"
                          placeholder="Enter Persons Entitled To Use/Drive"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="personsEntitledToUse"
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
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lightBlue hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

export default ProposalCreateCertificate;
