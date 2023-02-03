import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import NotificationContext from "@/store/notification-context";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { changePhone } from "lib/config";

const CreateInsuredPoliceReport = gql`
  mutation CreateInsuredPoliceReport($input: insuredPoliceReportCreateInput!) {
    createInsuredPoliceReport(input: $input) {
      id
      incidentNumber
      victimDriverName
      victimLicenceNumber
      victimLevel
      victimRegion
      victimCity
      victimSubCity
      victimWereda
      victimKebelle
      victimHouseNo
      victimPhoneNumber
      incidentCause
      incidentDate
      incidentPlace
      incidentTime
      responsibleDriverName
      responsiblePhoneNumber
      reportDate
      victims {
        id
        victimName
        victimCondition
        injuryType
        victimAddress
        victimFamilyPhoneNumber
        victimHospitalized
        createdAt
        updatedAt
      }
      vehicle_PoliceReport_victimVehicle {
        plateNumber
      }
      vehicle_PoliceReport_responsibleVehicle {
        plateNumber
      }
      policeBranch {
        id
      }
      claims {
        damageEstimate
      }
      trafficPolices {
        id
      }
    }
  }
`;

const CreateInsuredPoliceReportPage = ({
  plateCode,
  regionCode,
  userId,
  href,
  branchId,
}) => {
  const router = useRouter();
  const notificationCtx = useContext(NotificationContext);

  const [plateRegionOption, setPlateRegionOption] = useState(regionCode);
  const [plateCodeOption, setPlateCodeOption] = useState(plateCode);

  const phoneRegExp = /^(^\+251|^251|^0)?9\d{8}$/;
  const plateNumberRegExp = /^([A-Da-d])?\d{5}$/;

  const victimConditionOptions = [
    { value: "PASSENGER", label: "PASSENGER" },
    { value: "PEDESTRIAN", label: "PEDESTRIAN" },
    { value: "DRIVER", label: "DRIVER" },
    { value: "ASSISTANT", label: "ASSISTANT" },
  ];

  const injuryTypeOptions = [
    { value: "SIMPLE", label: "SIMPLE" },
    { value: "CRITICAL", label: "CRITICAL" },
    { value: "DEATH", label: "DEATH" },
  ];

  // const victimedGroup = {
  //   victimedName: "",
  //   victimedCondition: "",
  //   injuryType: "",
  //   victimedAddress: "",
  //   victimedFamilyPhoneNumber: "",
  //   victimedHospitalized: "",
  // };

  const initialValues = {
    victimLicenceNumber: "",
    victimLevel: "",
    victimRegion: "",
    victimCity: "",
    victimSubCity: "",
    victimWereda: "",
    victimKebelle: "",
    victimHouseNo: "",
    victimPhoneNumber: "",
    incidentCause: "",
    incidentDate: "",
    incidentPlace: "",
    incidentTime: "",
    victims: [],
    responsibleDriverName: "",
    responsiblePhoneNumber: "",
    victimVehiclePlateCode: "",
    victimVehiclePlateRegion: "",
    victimVehiclePlateNumber: "",
    responsibleVehiclePlateCode: "",
    responsibleVehiclePlateRegion: "",
    responsibleVehiclePlateNumber: "",
    damageEstimate: "",
  };

  const validate = Yup.object().shape({
    victimDriverName: Yup.string().required("Victim DriverName Is Required"),
    victimLicenceNumber: Yup.string().required(
      "Victim Licence Number Is Required"
    ),
    victimLevel: Yup.string().required("Victim Level Is Required"),
    victimRegion: Yup.string().required("Victim Region Is Required"),
    victimCity: Yup.string().required("Victim City Is Required"),
    victimSubCity: Yup.string().required("Victim SubCity Is Required"),
    victimWereda: Yup.string().required("Victim Wereda Is Required"),
    victimKebelle: Yup.string().required("Victim Kebelle Is Required"),
    victimHouseNo: Yup.string().required("Victim HouseNo Is Required"),
    victimPhoneNumber: Yup.string()
      .matches(phoneRegExp, "Victim Driver Phone Number Is Not Valid")
      .required("Responsible Driver Phone Number Is Required"),
    incidentCause: Yup.string().required("Incident Cause Is Required"),
    incidentDate: Yup.date().required("Incident Date Is Required"),
    incidentPlace: Yup.string().required("Incident Place Is Required"),
    incidentTime: Yup.string().required("Incident Time Is Required"),
    responsibleDriverName: Yup.string().required(
      "Responsible Driver Name Is Required"
    ),
    responsiblePhoneNumber: Yup.string()
      .matches(phoneRegExp, "Responsible Driver Phone Number Is Not Valid")
      .required("Responsible Driver Phone Number Is Required"),
    victimVehiclePlateCode: Yup.string().required(
      "Victim Vehicle Plate Code Is Required"
    ),
    victimVehiclePlateRegion: Yup.string().required(
      "Victim Vehicle Plate Region Is Required"
    ),
    victimVehiclePlateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Victim Vehicle Plate Number Is Required"),
    // branchName: Yup.string().required("Branch Name Is Required"),
    responsibleVehiclePlateCode: Yup.string().required(
      "Responsible Vehicle Plate Code Is Required"
    ),
    responsibleVehiclePlateRegion: Yup.string().required(
      "Responsible Vehicle Plate Region Is Required"
    ),
    responsibleVehiclePlateNumber: Yup.string()
      .matches(plateNumberRegExp, "Plate Number Is Not Valid")
      .required("Responsible Vehicle Plate Number Is Required"),
    damageEstimate: Yup.number()
      .typeError("You Must Specify A Number")
      .required("Damage Estimate Is Required"),
  });

  const [formValues, setFormValues] = useState(null);

  const [createPoliceReport, { data, error, loading }] = useMutation(
    CreateInsuredPoliceReport
  );
  if (error) {
    console.log(error);
  }

  const onSubmit = async (values: any) => {
    const input = {
      victimDriverName: values.victimDriverName,
      victimLicenceNumber: values.victimLicenceNumber,
      victimLevel: values.victimLevel,
      victimRegion: values.victimRegion,
      victimCity: values.victimCity,
      victimSubCity: values.victimSubCity,
      victimWereda: values.victimWereda,
      victimKebelle: values.victimKebelle,
      victimHouseNo: values.victimHouseNo,
      victimPhoneNumber: changePhone(values.victimPhoneNumber),
      incidentCause: values.incidentCause,
      incidentDate: new Date(values.incidentDate),
      incidentPlace: values.incidentPlace,
      incidentTime: values.incidentTime,
      victims: [...values.victims],
      responsibleDriverName: values.responsibleDriverName,
      responsiblePhoneNumber: changePhone(values.responsiblePhoneNumber),
      trafficPoliceName: values.trafficPoliceName,
      trafficPolicePhoneNumber: values.trafficPolicePhoneNumber,
      policeStationName: values.policeStationName,
      vehicle_PoliceReport_victimVehicle: {
        plateNumber: `${values.victimVehiclePlateCode}${values.victimVehiclePlateRegion}${values.victimVehiclePlateNumber}`,
      },
      vehicle_PoliceReport_responsibleVehicle: {
        plateNumber: `${values.responsibleVehiclePlateCode}${values.responsibleVehiclePlateRegion}${values.responsibleVehiclePlateNumber}`,
      },
      policeBranch: {
        id: branchId,
      },
      trafficPolices: {
        id: userId,
      },
      claims: {
        damageEstimate: values.damageEstimate,
      },
    };
    // console.log(input);
    await createPoliceReport({
      variables: {
        input,
      },
      onError: (error) => {
        console.log(error);
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something Went Wrong",
          status: "error",
        });
      },
      onCompleted: (data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully Created Police Report",
          status: "success",
        });
      },
      update: (cache, { data }) => {
        const cacheId = cache.identify(data.message);
        cache.modify({
          fields: {
            messages: (existinFieldData, { toReference }) => {
              return [...existinFieldData, toReference(cacheId)];
            },
          },
        });
      },
    }).then(() => router.push(href));
  };
  return (
    <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
      <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-20">
        <div className="container px-2 py-5 mx-auto">
          <Formik
            initialValues={formValues || initialValues}
            validationSchema={validate}
            onSubmit={onSubmit}
          >
            {({ values }) => (
              <Form className="space-y-6 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                  <div>
                    <h3 className="text-lg leading-6 font-semibold text-gray-600">
                      Create Police Report For Insured Vehicle
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Please Add Carefully!!
                    </p>
                  </div>
                </div>
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="mt-5 md:mt-0 md:col-span-3">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimDriverName"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Driver Name
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimDriverName"
                            placeholder="Enter Victim Driver Name"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimDriverName" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimLicenceNumber"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Licence Number
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimLicenceNumber"
                            placeholder="Enter Victim Licence Number"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimLicenceNumber" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimLevel"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Level <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimLevel"
                            placeholder="Enter Victim Driver Level"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimLevel" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimRegion"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Region <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimRegion"
                            placeholder="Enter Victim Driver Region"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimRegion" />
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
                            htmlFor="victimCity"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim City <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimCity"
                            placeholder="Enter Victim Driver City"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimCity" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimSubCity"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim SubCity <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimSubCity"
                            placeholder="Enter Victim Driver SubCity"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimSubCity" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimWereda"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Wereda <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimWereda"
                            placeholder="Enter Victim Driver Wereda"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimWereda" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimKebelle"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Kebelle <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimKebelle"
                            placeholder="Enter Victim Driver Kebele"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimKebelle" />
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
                            htmlFor="victimHouseNo"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim HouseNo <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimHouseNo"
                            placeholder="Enter Victim Driver House No"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimHouseNo" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimPhoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Phone Number
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimPhoneNumber"
                            placeholder="Enter Victim Driver Phone Number"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimPhoneNumber" />
                          </div>
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label
                            htmlFor="victimVehiclePlateCode"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Vehicle PlateCode
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="number"
                            as="select"
                            name="victimVehiclePlateCode"
                            placeholder="Enter Victim Vehicle Plate Code"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option disabled value="">
                              Select plate Code
                            </option>
                            {plateCodeOption?.map((option: any) => (
                              <option key={option.id} value={option.code}>
                                {option.code}
                              </option>
                            ))}
                          </Field>
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimVehiclePlateCode" />
                          </div>
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label
                            htmlFor="victimVehiclePlateRegion"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Vehicle PLate Region
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            as="select"
                            name="victimVehiclePlateRegion"
                            placeholder="Enter Victim Vehicle Plate Region"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option disabled value="">
                              Select plate Region
                            </option>
                            {plateRegionOption?.map((option) => (
                              <option key={option.id} value={option.regionApp}>
                                {option.regionApp}
                              </option>
                            ))}
                          </Field>
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimVehiclePlateRegion" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="mt-5 md:mt-0 md:col-span-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="victimVehiclePlateNumber"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Victim Vehicle PlateNumber
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="victimVehiclePlateNumber"
                            placeholder="Enter Victim Vehicle Plate Number"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="victimVehiclePlateNumber" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="incidentCause"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Incident Cause <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="incidentCause"
                            placeholder="Enter Incident Cause"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="incidentCause" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="incidentDate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Incident Date <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="date"
                            name="incidentDate"
                            placeholder="Enter Incident Date"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="incidentDate" />
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
                            htmlFor="incidentPlace"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Incident Place <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="incidentPlace"
                            placeholder="Enter Incident Place"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="incidentPlace" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="incidentTime"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Incident Time <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="time"
                            name="incidentTime"
                            // placeholder="Enter Incident Time"
                            className="timepicker appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="incidentTime" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="responsibleDriverName"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Responsible Driver Name
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="responsibleDriverName"
                            placeholder="Enter Responsible Driver Name"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="responsibleDriverName" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="responsiblePhoneNumber"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Responsible Driver PhoneNumber
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            step="any"
                            name="responsiblePhoneNumber"
                            placeholder="Enter Responsible Driver PhoneNumber"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="responsiblePhoneNumber" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="mt-5 md:mt-0 md:col-span-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="responsibleVehiclePlateCode"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Responsible Vehicle PlateCode
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="number"
                            as="select"
                            name="responsibleVehiclePlateCode"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option disabled value="">
                              Select plate Code
                            </option>
                            {plateCodeOption?.map((option: any) => (
                              <option key={option.id} value={option.code}>
                                {option.code}
                              </option>
                            ))}
                          </Field>
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="responsibleVehiclePlateCode" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="responsibleVehiclePlateRegion"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Responsible Vehicle PLate Region
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            as="select"
                            name="responsibleVehiclePlateRegion"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          >
                            <option disabled value="">
                              Select plate Region
                            </option>
                            {plateRegionOption?.map((option: any) => (
                              <option key={option.id} value={option.regionApp}>
                                {option.regionApp}
                              </option>
                            ))}
                          </Field>
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="responsibleVehiclePlateRegion" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="responsibleVehiclePlateNumber"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Responsible Vehicle PlateNumber
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="text"
                            name="responsibleVehiclePlateNumber"
                            placeholder="Enter Responsible Vehicle PlateNumber"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="responsibleVehiclePlateNumber" />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1">
                          <label
                            htmlFor="damageEstimate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Damage Estimate
                            <span className="text-eRed">*</span>
                          </label>
                          <Field
                            type="number"
                            step="any"
                            name="damageEstimate"
                            placeholder="Enter Estimated Damage"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="text-eRed text-sm italic mt-2">
                            <ErrorMessage name="damageEstimate" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <FieldArray
                    name="victims"
                    render={(arrayHelpers) => (
                      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                        <div className="md:grid md:grid-cols-3 md:gap-6">
                          <div className="mt-5 md:mt-0 md:col-span-3">
                            {values.victims && values.victims.length > 0 ? (
                              values.victims.map((_, index: any) => (
                                <div key={index}>
                                  <div
                                    className="grid grid-cols-6 gap-3"
                                    // key={index + 1}
                                  >
                                    <div className="col-span-6 sm:col-span-1">
                                      <label
                                        htmlFor={`victims.${index}.victimName`}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                      >
                                        Victim Name
                                      </label>
                                      <Field
                                        name={`victims.${index}.victimName`}
                                        placeholder="Enter Victim Name"
                                        className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    <div className="col-span-6 sm:col-span-1">
                                      <label
                                        htmlFor={`victims.${index}.victimCondition`}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                      >
                                        Victim Condition
                                      </label>
                                      <Field
                                        name={`victims.${index}.victimCondition`}
                                        as="select"
                                        className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      >
                                        <option disabled value="">
                                          Select Victim Condition
                                        </option>
                                        {victimConditionOptions.map(
                                          (option: any) => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          )
                                        )}
                                      </Field>
                                    </div>
                                    <div className="col-span-6 sm:col-span-1">
                                      <label
                                        // htmlFor="injuryType"
                                        htmlFor={`victims.${index}.injuryType`}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                      >
                                        Injury Type
                                      </label>
                                      <Field
                                        name={`victims.${index}.injuryType`}
                                        as="select"
                                        className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      >
                                        <option disabled value="">
                                          Select Injury Type
                                        </option>
                                        {injuryTypeOptions.map(
                                          (option: any) => (
                                            <option
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </option>
                                          )
                                        )}
                                      </Field>
                                    </div>
                                    <div className="col-span-6 sm:col-span-1">
                                      <label
                                        htmlFor={`victims.${index}.victimAddress`}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                      >
                                        Victim Address
                                      </label>
                                      <Field
                                        name={`victims.${index}.victimAddress`}
                                        placeholder="Enter Victim Address"
                                        className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    <div className="col-span-6 sm:col-span-1">
                                      <label
                                        htmlFor={`victims.${index}.victimFamilyPhoneNumber`}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                      >
                                        Victim FamilyPhoneNumber
                                      </label>
                                      <Field
                                        name={`victims.${index}.victimFamilyPhoneNumber`}
                                        placeholder="Enter Victim Family Phone Number"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                    <div className="col-span-6 sm:col-span-1">
                                      <label
                                        htmlFor={`victims.${index}.victimHospitalized`}
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                      >
                                        Victim Hospitalize
                                      </label>
                                      <Field
                                        name={`victims.${index}.victimHospitalized`}
                                        placeholder="Enter Victim Hospitalize"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      />
                                    </div>
                                  </div>
                                  <div className="pt-5">
                                    <div className="flex justify-center">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        } // remove a friend from the list
                                        className="py-2 px-4 bordertext-sm font-medium"
                                      >
                                        <AiFillMinusCircle
                                          className="flex-shrink-0 h-8 w-8 text-sm font-medium text-lightGreen hover:text-deepBlue"
                                          aria-hidden="true"
                                        />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          arrayHelpers.insert(index, "")
                                        }
                                        className="py-2 px-4 bordertext-sm font-medium"
                                      >
                                        <AiFillPlusCircle
                                          className="flex-shrink-0 h-8 w-8 text-sm font-medium text-lightGreen hover:text-deepBlue"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <button
                                type="button"
                                onClick={() => arrayHelpers.push("")}
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lightGreen hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                {/* show this when user has removed all friends from the list */}
                                Add a Victimed
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <div className="pt-5">
                  <div className="flex justify-center">
                    <Link href={href} passHref>
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </Link>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-lightGreen hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateInsuredPoliceReportPage;
