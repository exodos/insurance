import { useContext } from "react";
import { changePhone } from "lib/config";
import {
  FormContext,
  VehicleInfoContext,
} from "@/pages/branch/certificate/proposal-create-insurance";
import NotificationContext from "@/store/notification-context";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";

const CreateInsuranceByBranch = gql`
  mutation CreateInsuranceByBranch($input: InsuranceCreateInput!) {
    createInsuranceByBranch(input: $input) {
      id
      certificateNumber
      status
      premiumTarif
      issuedDate
      updatedAt
      policies {
        id
        policyNumber
        policyStartDate
        policyExpireDate
        policyIssuedConditions
        personsEntitledToUse
        createdAt
        updatedAt
      }
      vehicles {
        id
        plateNumber
        engineNumber
        chassisNumber
        vehicleModel
        bodyType
        horsePower
        manufacturedYear
        vehicleType
        vehicleSubType
        vehicleDetails
        vehicleUsage
        vehicleCategory
        premiumTarif
        passengerNumber
        carryingCapacityInGoods
        purchasedYear
        dutyFreeValue
        dutyPaidValue
        vehicleStatus
        isInsured
        createdAt
        updatedAt
        insureds {
          id
          regNumber
          firstName
          lastName
          occupation
          region
          city
          subCity
          wereda
          kebelle
          houseNumber
          mobileNumber
          createdAt
          updatedAt
        }
      }
      branchs {
        id
      }
    }
  }
`;

const ProposalDetails = () => {
  const { activeStepIndex, setActiveStepIndex, formData } =
    useContext(FormContext);
  const notificationCtx = useContext(NotificationContext);

  const { branchId, returnPath } = useContext(VehicleInfoContext);
  const router = useRouter();
  // const userRole = session?.user?.memberships?.role;

  const [createInsurance, { data, error, loading }] = useMutation(
    CreateInsuranceByBranch
  );

  if (error) {
    console.log(error);
  }

  const onSubmit = async () => {
    const input = {
      policies: {
        policyStartDate: new Date(formData.policyStartDate),
        policyIssuedConditions: formData.policyIssuedConditions,
        personsEntitledToUse: formData.personsEntitledToUse,
      },
      vehicles: {
        plateNumber: `${formData.plateCode}${formData.plateRegion}${formData.plateNumber}`,
        engineNumber: formData.engineNumber,
        chassisNumber: formData.chassisNumber,
        vehicleModel: formData.vehicleModel,
        bodyType: formData.bodyType,
        horsePower: formData.horsePower,
        manufacturedYear: Number(formData.manufacturedYear),
        vehicleType: formData.vehicleType,
        vehicleSubType: formData.vehicleSubType,
        vehicleDetails: formData.vehicleDetails,
        vehicleUsage: formData.vehicleUsage,
        vehicleCategory: formData.vehicleCategory,
        passengerNumber: Number(formData.passengerNumber),
        carryingCapacityInGoods: formData.carryingCapacityInGoods,
        purchasedYear: Number(formData.purchasedYear),
        dutyFreeValue: Number(formData.dutyFreeValue),
        dutyPaidValue: Number(formData.dutyPaidValue),
        vehicleStatus: formData.vehicleStatus,
        insureds: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          occupation: formData.occupation,
          region: formData.region,
          city: formData.city,
          subCity: formData.subCity,
          wereda: formData.wereda,
          kebelle: formData.kebelle,
          houseNumber: formData.houseNumber,
          mobileNumber: formData.mobileNumber,
        },
      },
      branchs: {
        id: branchId,
      },
    };

    // console.log(input);

    await createInsurance({
      variables: {
        input,
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
          message: "Successfully Created Vehicle Data",
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
    }).then(() => router.push(returnPath));
  };

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-2xl pt-8 pb-24 sm:px-6 sm:pt-16 lg:max-w-7xl lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Insurance Details
            </h1>
          </div>
        </div>
        <section aria-labelledby="products-heading" className="mt-6">
          {/* <form onSubmit={onSubmit}> */}
          <div className="space-y-2 ml-20">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 py-2 sm:grid-cols-2 sm:gap-y-0 lg:grid-cols-4">
                <div className="grid grid-cols-1 gap-y-10 lg:col-span-2 lg:grid-cols-2 lg:gap-y-0 lg:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Policy Start Date
                    </h3>
                    <div className="mt-1 space-y-6 text-gray-500">
                      {formData.policyStartDate}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Conditions Subject To Which The Policy Is Issued
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.policyIssuedConditions}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-y-10 lg:col-span-2 lg:grid-cols-2 lg:gap-y-0 lg:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Persons Entitled To Use/Drive
                    </h3>
                    <div className="mt-1 space-y-6 text-gray-400">
                      {formData.personsEntitledToUse}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 py-1 sm:grid-cols-2 sm:gap-y-0 lg:grid-cols-4">
                <div className="grid grid-cols-1 gap-y-10 lg:col-span-3 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      First Name
                    </h3>
                    <div className="space-y-6 text-gray-500">
                      {formData.firstName}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Last Name
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.lastName}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Occupation
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.occupation}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Region
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.region}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">City</h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.city}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      SubCity
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.subCity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-y-0 lg:grid-cols-4">
                <div className="grid grid-cols-1 gap-y-10 lg:col-span-4 lg:grid-cols-4 lg:gap-y-0 lg:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Wereda
                    </h3>
                    <div className="mt-1 space-y-6 text-gray-500">
                      {formData.wereda}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Kebelle
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.kebelle}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      House Number
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.houseNumber}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Mobile Number
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.mobileNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-2">
              <div className="grid grid-cols-2 gap-8 py-2 sm:grid-cols-2 sm:gap-y-0 lg:grid-cols-4">
                <div className="grid grid-cols-3 gap-y-10 lg:col-span-3 lg:grid-cols-3 lg:gap-y-0 lg:gap-x-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Plate Number
                    </h3>
                    <div className="mt-1 space-y-6 text-gray-500">
                      {formData.plateCode}
                      {formData.plateRegion}
                      {formData.plateNumber}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Engine Number
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.engineNumber}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Chassis Number
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.chassisNumber}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Vehicle Model
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.vehicleModel}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Body Type
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.bodyType}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Horse Power
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.horsePower}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Manufactured Year
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.manufacturedYear}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Type Of Vehicle
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.vehicleType}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Sub Type Of Vehicle
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.vehicleSubType}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Detail Of Vehicle
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.vehicleDetails}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">Usage</h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.vehicleUsage}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Category
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.vehicleCategory}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Number Of Passenger
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.passengerNumber}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Carrying CapacityInGoods
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.carryingCapacityInGoods}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Purchased Year
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.purchasedYear}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Duty Free Value
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.dutyFreeValue}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Duty Paid Value
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.dutyPaidValue}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Vehicle Status
                    </h3>
                    <div className="space-y-6 text-gray-400">
                      {formData.vehicleStatus}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex justify-end space-x-3">
              <Link href={returnPath} passHref legacyBehavior>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                onClick={onSubmit}
                className="inline-flex justify-center rounded-md border border-transparent bg-lightGreen py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-deepGreen focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create
              </button>
            </div>
          </div>
          {/* </form> */}
        </section>
      </main>
    </div>
  );
};

export default ProposalDetails;
