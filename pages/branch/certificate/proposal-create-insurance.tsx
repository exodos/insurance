import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { gql } from "@apollo/client";
import { createContext, useState } from "react";
import { initializeApollo } from "@/lib/apollo";
import Stepper from "@/components/proposal/Stepper";
import Step from "@/components/proposal/Step";
import { useRouter } from "next/router";

const PlateCode = gql`
  query PlateCode {
    plateCode {
      id
      code
    }
    regionCode {
      id
      regionApp
    }
    feedUniqueTariff {
      tariffVehicleType {
        id
        vehicleType
      }
      tariffVehicleSubType {
        id
        vehicleSubType
      }
      tariffVehicleDetail {
        id
        vehicleDetail
      }
      tariffVehicleUsage {
        id
        vehicleUsage
      }
      tariffVehicleCategory {
        id
        vehicleCategory
      }
    }
  }
`;

export const FormContext = createContext(null!);
export const VehicleInfoContext = createContext(null!);
const CreateProposal = ({
  data,
  branchId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState({});

  const router = useRouter();
  const [returnPath, setReturnPath] = useState(router.query.returnPage);
  // console.log("return path", returnPath);

  const [plateRegionOption, setPlateRegionOption] = useState(data?.regionCode);
  const [plateCodeOption, setPlateCodeOption] = useState(data?.plateCode);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState(
    data?.feedUniqueTariff?.tariffVehicleType
  );
  const [vehicleSubTypeOptions, setVehicleSubTypeOptions] = useState(
    data?.feedUniqueTariff?.tariffVehicleSubType
  );
  const [vehicleDetailOptions, setVehicleDetailOptions] = useState(
    data?.feedUniqueTariff?.tariffVehicleDetail
  );
  const [vehicleUsageOptions, setVehicleUsageOptions] = useState(
    data?.feedUniqueTariff?.tariffVehicleUsage
  );
  const [vehicleCategoryOptions, setVehicleCategoryOptions] = useState(
    data?.feedUniqueTariff?.tariffVehicleCategory
  );

  return (
    <FormContext.Provider
      value={{ activeStepIndex, setActiveStepIndex, formData, setFormData }}
    >
      <VehicleInfoContext.Provider
        value={{
          plateRegionOption,
          plateCodeOption,
          vehicleTypeOptions,
          vehicleSubTypeOptions,
          vehicleDetailOptions,
          vehicleUsageOptions,
          vehicleCategoryOptions,
          branchId,
          returnPath,
        }}
      >
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <Stepper />
          <Step />
        </div>
      </VehicleInfoContext.Provider>
    </FormContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/sign-in",
      },
    };
  } else if (session.user.adminRestPassword) {
    return {
      redirect: {
        destination: "/user/force-reset",
        permanent: false,
      },
    };
  }
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: PlateCode,
  });

  return {
    props: {
      session,
      data,
      branchId: session.user.memberships.branchId,
    },
  };
};

export default CreateProposal;
