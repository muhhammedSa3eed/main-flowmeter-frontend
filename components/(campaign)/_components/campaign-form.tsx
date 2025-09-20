"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { containerCampaignForm as container } from "@/framer-motion";
import { useMultiStepForm } from "@/hooks/multi-step-form";
import { motion } from "framer-motion";
import { CampaignFormContext } from "./multi-step-campaign-config";
import MultiStepNavbar from "@/components/multi-step-form/multi-step-navbar";
import { MultiStepForm } from "@/components/multi-step-form/multi-step-form";
import MultiStepNavButtons from "@/components/multi-step-form/multi-step-nav-buttons";

const CampaignForm = ({ RfpId ,token}: { RfpId: number ;token:string}) => {
  const { CurrentForm } = useMultiStepForm(CampaignFormContext, RfpId,token);

  return (

    <Card className="w-full max-w-4xl mx-auto border-green-500 mt-5 p-2 ">
      {/* MultiStepNavbar at the top */}
      <CardHeader className="mb-5 border-none flex justify-center px-4 sm:px-6">
        <MultiStepNavbar context={CampaignFormContext} RfpId={RfpId} />
      </CardHeader>

      {/* MultiStepForm underneath MultiStepNavbar */}
      <CardContent className="flex flex-col  px-4 sm:px-6 pb-6">
        <MultiStepForm RfpId={RfpId}>
          <div className="flex flex-col flex-1  min-w-fit ">
            <motion.div
              variants={container}
              className="flex flex-col"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CurrentForm />
            </motion.div>
            <MultiStepNavButtons
              context={CampaignFormContext}
              previousLabel="Previous"
              nextLabel="Next"
              endStepCreateLabel="Save"
              endStepUpdateLabel="Update"
              RfpId={RfpId}
            />
          </div>
        </MultiStepForm>
      </CardContent>
    </Card>

  );
};

export default CampaignForm;
