import { FormContext } from "@/pages/branch/certificate/proposal-create-insurance";
import React, { useContext } from "react";
import ProposalCreateCertificate from "./proposal-create-certificate";
import ProposalCreateInsured from "./proposal-create-insured";
import ProposalCreatevehicle from "./proposal-create-vehicle";
import ProposalDetails from "./proposal-details";

function Step() {
  const { activeStepIndex } = useContext(FormContext);
  // console.log(activeStepIndex);
  switch (activeStepIndex) {
    case 0:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <ProposalCreateCertificate />
          </div>
        </div>
      );
    case 1:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <ProposalCreateInsured />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <ProposalCreatevehicle />
          </div>
        </div>
      );
    case 3:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <ProposalDetails />
          </div>
        </div>
      );
    default:
      break;
  }

  // return stepContent;
}

export default Step;
