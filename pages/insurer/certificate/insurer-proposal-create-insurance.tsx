import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { gql } from "@apollo/client";
import { createContext, useState } from "react";
import { initializeApollo } from "@/lib/apollo";
import { useRouter } from "next/router";
import InsurerStep from "@/components/proposal/insurer-step";
import InsurerStepper from "@/components/proposal/insurer-stepper";

const FeedBranchByOrg = gql`
  query FeedBranchByOrg($orgId: String!) {
    feedBranchByOrg(orgId: $orgId) {
      branchs {
        id
        branchName
      }
    }
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

export const InsurerFormContext = createContext(null!);
export const InsurerVehicleInfoContext = createContext(null!);

const InsurerCreateProposal = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState({});

  const router = useRouter();
  const [returnPath, setReturnPath] = useState(router.query.returnPage);

  const [branchOptions, setBranchOptions] = useState(
    data?.feedBranchByOrg?.branchs
  );
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
    <InsurerFormContext.Provider
      value={{ activeStepIndex, setActiveStepIndex, formData, setFormData }}
    >
      <InsurerVehicleInfoContext.Provider
        value={{
          plateRegionOption,
          plateCodeOption,
          vehicleTypeOptions,
          vehicleSubTypeOptions,
          vehicleDetailOptions,
          vehicleUsageOptions,
          vehicleCategoryOptions,
          returnPath,
          branchOptions,
        }}
      >
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <InsurerStepper />
          <InsurerStep />
        </div>
      </InsurerVehicleInfoContext.Provider>
    </InsurerFormContext.Provider>
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
  } else if (session?.user?.memberships?.role !== "INSURER") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedBranchByOrg,
    variables: {
      orgId: session.user.memberships.branchs.orgId,
    },
  });

  return {
    props: {
      session,
      data,
      branchId: session?.user?.memberships?.branchId,
    },
  };
};

export default InsurerCreateProposal;
