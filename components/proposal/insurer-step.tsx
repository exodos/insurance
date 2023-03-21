import React, { useContext } from "react";
import ProposalCreateInsured from "./proposal-create-insured";
import ProposalCreatevehicle from "./proposal-create-vehicle";
import ProposalDetails from "./proposal-details";
import InsurerProposalCreateCertificate from "./insurer-proposal-create-certificate";
import { InsurerFormContext } from "@/pages/insurer/certificate/insurer-proposal-create-insurance";
import InsurerProposalCreateInsured from "./insurer-proposal-create-insured";
import InsurerProposalCreatevehicle from "./insurer-proposal-create-vehicle";
import InsurerProposalDetails from "./insurer-proposal-details";

function InsurerStep() {
  const { activeStepIndex } = useContext(InsurerFormContext);
  switch (activeStepIndex) {
    case 0:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <InsurerProposalCreateCertificate />
          </div>
        </div>
      );
    case 1:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <InsurerProposalCreateInsured />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <InsurerProposalCreatevehicle />
          </div>
        </div>
      );
    case 3:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <InsurerProposalDetails />
          </div>
        </div>
      );
    default:
      break;
  }
}

export default InsurerStep;
