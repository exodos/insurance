import React, { useContext } from "react";
import { AdminFormContext } from "@/pages/admin/certificate/admin-proposal-create-insurance";
import AdminProposalCreateCertificate from "./admin-proposal-create-certificate";
import AdminProposalCreateInsured from "./admin-proposal-create-insured";
import AdminProposalCreatevehicle from "./admin-proposal-create-vehicle";
import AdminProposalDetails from "./admin-proposal-details";

function AdminStep() {
  const { activeStepIndex } = useContext(AdminFormContext);
  switch (activeStepIndex) {
    case 0:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <AdminProposalCreateCertificate />
          </div>
        </div>
      );
    case 1:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <AdminProposalCreateInsured />
          </div>
        </div>
      );
    case 2:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <AdminProposalCreatevehicle />
          </div>
        </div>
      );
    case 3:
      return (
        <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="text-gray-900 body-font overflow-hidden bg-white mb-20 border-2 rounded-3xl border-gray-200 mt-8">
            <AdminProposalDetails />
          </div>
        </div>
      );
    default:
      break;
  }
}

export default AdminStep;
