import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { gql } from "@apollo/client";
import { createContext, useState } from "react";
import { initializeApollo } from "@/lib/apollo";
import { useRouter } from "next/router";
import AdminStepper from "@/components/proposal/admin-stepper";
import AdminStep from "@/components/proposal/admin-step";

const ListAllBranch = gql`
  query FeedBranchByOrgDesc($input: orgDescInput!) {
    feedBranchByOrgDesc(input: $input) {
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

export const AdminFormContext = createContext(null!);
export const AdminVehicleInfoContext = createContext(null!);

const AdminCreateProposal = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState({});

  const router = useRouter();
  const [returnPath, setReturnPath] = useState(router.query.returnPage);

  const [branchOptions, setBranchOptions] = useState(
    data?.feedBranchByOrgDesc?.branchs
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
    <AdminFormContext.Provider
      value={{ activeStepIndex, setActiveStepIndex, formData, setFormData }}
    >
      <AdminVehicleInfoContext.Provider
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
          <AdminStepper />
          <AdminStep />
        </div>
      </AdminVehicleInfoContext.Provider>
    </AdminFormContext.Provider>
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
  } else if (session.user.memberships.role !== "SUPERADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: ListAllBranch,
    variables: {
      input: {
        description: "INSURANCE",
      },
    },
  });

  return {
    props: {
      session,
      data,
      branchId: session.user.memberships.branchId,
    },
  };
};

export default AdminCreateProposal;
