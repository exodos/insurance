import { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FormContext,
  VehicleInfoContext,
} from "@/pages/branch/certificate/proposal-create-insurance";

const ProposalCreatevehicle = () => {
  const { activeStepIndex, setActiveStepIndex, formData, setFormData } =
    useContext(FormContext);

  const {
    plateRegionOption,
    plateCodeOption,
    vehicleTypeOptions,
    vehicleSubTypeOptions,
    vehicleDetailOptions,
    vehicleUsageOptions,
    vehicleCategoryOptions,
  } = useContext(VehicleInfoContext);

  const renderError = (message) => (
    <p className="italic text-red-600">{message}</p>
  );

  const vehicleStatusOptions = [
    { value: "NEW", label: "NEW" },
    { value: "RENEWAL", label: "RENEWAL" },
    { value: "ADDITIONAL", label: "ADDITIONAL" },
  ];

  const plateNumberRegExp = /^([A-Da-d])?\d{5}$/;

  const initialValues = {
    plateCode: "",
    plateRegion: "",
    plateNumber: "",
    engineNumber: "",
    chassisNumber: "",
    vehicleModel: "",
    bodyType: "",
    horsePower: "",
    manufacturedYear: "",
    vehicleType: "",
    vehicleSubType: "",
    vehicleDetails: "",
    vehicleUsage: "",
    vehicleCategory: "",
    passengerNumber: "",
    carryingCapacityInGoods: "",
    purchasedYear: "",
    dutyFreeValue: "",
    dutyPaidValue: "",
    vehicleStatus: "",
    // mobileNumber: "",
    // branchName: "",
  };

  const validate = Yup.object().shape({
    plateCode: Yup.string().required("Plate Code Is Required"),
    plateRegion: Yup.string().required("Plate Region Is Required"),
    plateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Plate Number Is Required"),
    engineNumber: Yup.string().required("Engine Number Is Required"),
    chassisNumber: Yup.string().required("Chassis Number Is Required"),
    vehicleModel: Yup.string().required("Vehicle Model Is Required"),
    bodyType: Yup.string().required("Body Type Is Required"),
    horsePower: Yup.string().required("Horse Power Is Required"),
    manufacturedYear: Yup.number().required("Manufactured Year Is Required"),
    vehicleType: Yup.string().required("Vehicle Type Is Required"),
    vehicleSubType: Yup.string().required("Vehicle Sub Type Is Required"),
    vehicleDetails: Yup.string().required("Vehicle Detail Is Required"),
    vehicleUsage: Yup.string().required("Vehicle Usage Is Required"),
    vehicleCategory: Yup.string().required("Vehicle Category Is Required"),
    passengerNumber: Yup.number().required("Passenger Number Is Required"),
    purchasedYear: Yup.number().required("Purchased Year Is Required"),
    dutyFreeValue: Yup.number().required("Duty Free Value Is Required"),
    dutyPaidValue: Yup.number().required("Duty Paid Value Is Required"),
    vehicleStatus: Yup.string().required("Vehicle Status Is Required"),
  });

  return (
    <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
      <h1 className="text-lg font-semibold text-gray-700 pt-5">
        Create Vehicle
      </h1>
      <p className="text-base font-medium text-gray-500">
        Please enter detail for the vehicles
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
                          htmlFor="plateCode"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Plate Code
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="plateCode"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Plate Code
                          </option>
                          {plateCodeOption.map((option: any) => (
                            <option key={option.code} value={option.code}>
                              {option.code}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage name="plateCode" render={renderError} />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="plateRegion"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Plate Region
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="plateRegion"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Plate Region
                          </option>
                          {plateRegionOption.map((option: any) => (
                            <option
                              key={option.regionApp}
                              value={option.regionApp}
                            >
                              {option.regionApp}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage
                            name="plateRegion"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="plateNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Plate Number
                        </label>
                        <Field
                          type="text"
                          name="plateNumber"
                          placeholder="Enter Plate Number"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="plateNumber"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="engineNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Engine Number <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="engineNumber"
                          placeholder="Enter Engine Number"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="engineNumber"
                            render={renderError}
                          />
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
                          htmlFor="chassisNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Chassis Number <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="chassisNumber"
                          placeholder="Enter Chassis Number"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="chassisNumber"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="vehicleModel"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Vehicle Model <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="vehicleModel"
                          placeholder="Enter Vehicle Model"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="vehicleModel"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="bodyType"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Body Type <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="bodyType"
                          placeholder="Enter Body Type"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage name="bodyType" render={renderError} />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="horsePower"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Horse Power <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="text"
                          name="horsePower"
                          placeholder="Enter Horse Power"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="horsePower"
                            render={renderError}
                          />
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
                          htmlFor="manufacturedYear"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Manufactured Year <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="number"
                          name="manufacturedYear"
                          placeholder="Enter Manufactured Year"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="manufacturedYear"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="vehicleType"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Vehicle Type
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="vehicleType"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Vehicle Type
                          </option>
                          {vehicleTypeOptions.map((option: any) => (
                            <option key={option.id} value={option.vehicleType}>
                              {option.vehicleType}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage
                            name="vehicleType"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="vehicleSubType"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Vehicle Sub Type <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="vehicleSubType"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Vehicle Sub Type
                          </option>
                          {vehicleSubTypeOptions.map((option: any) => (
                            <option
                              key={option.id}
                              value={option.vehicleSubType}
                            >
                              {option.vehicleSubType}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage
                            name="vehicleSubType"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="vehicleDetails"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Vehicle Details
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="vehicleDetails"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Vehicle Details
                          </option>
                          {vehicleDetailOptions.map((option: any) => (
                            <option
                              key={option.id}
                              value={option.vehicleDetail}
                            >
                              {option.vehicleDetail}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage
                            name="vehicleDetails"
                            render={renderError}
                          />
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
                          htmlFor="vehicleUsage"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Usage
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="vehicleUsage"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Usage
                          </option>
                          {vehicleUsageOptions.map((option: any) => (
                            <option key={option.id} value={option.vehicleUsage}>
                              {option.vehicleUsage}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage
                            name="vehicleUsage"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="vehicleCategory"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Vehicle Category
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="vehicleCategory"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Usage
                          </option>
                          {vehicleCategoryOptions.map((option: any) => (
                            <option
                              key={option.id}
                              value={option.vehicleCategory}
                            >
                              {option.vehicleCategory}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage
                            name="vehicleCategory"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="dutyFreeValue"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Duty Free Value
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="number"
                          step="any"
                          name="dutyFreeValue"
                          placeholder="Enter Duty Free Value"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="dutyFreeValue"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="dutyPaidValue"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Duty Paid Value
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="number"
                          step="any"
                          name="dutyPaidValue"
                          placeholder="Enter Duty Paid Value"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="dutyPaidValue"
                            render={renderError}
                          />
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
                          htmlFor="passengerNumber"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Passenger Number
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="number"
                          name="passengerNumber"
                          placeholder="Enter Passenger Number"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="passengerNumber"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="carryingCapacityInGoods"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Carrying Capacity
                        </label>
                        <Field
                          type="text"
                          name="carryingCapacityInGoods"
                          placeholder="Enter Goods/Litre Carrying Capacity"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="purchasedYear"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Purchased Year
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          type="number"
                          name="purchasedYear"
                          placeholder="Enter Purchased Year"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-2">
                          <ErrorMessage
                            name="purchasedYear"
                            render={renderError}
                          />
                        </div>
                      </div>
                      <div className="col-span-4 sm:col-span-1">
                        <label
                          htmlFor="vehicleStatus"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Vehicle Status
                          <span className="text-eRed">*</span>
                        </label>
                        <Field
                          as="select"
                          name="vehicleStatus"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option disabled value="">
                            Select Vehicle Status
                          </option>
                          {vehicleStatusOptions.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <div className="mt-2">
                          <ErrorMessage
                            name="vehicleStatus"
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
                    className="rounded-md border border-gray-300 bg-lightBlue ml-5 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-deepBlue focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit
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

export default ProposalCreatevehicle;
