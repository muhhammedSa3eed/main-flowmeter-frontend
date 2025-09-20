"use client";

import { containerMultiStepForm as container } from "@/framer-motion";
import { useMultiStepForm } from "@/hooks/multi-step-form";
import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
import React, { PropsWithChildren } from "react";
import { Card, CardContent } from "../ui/card";
import { CampaignFormContext } from "../(campaign)/_components/multi-step-campaign-config";

interface Props extends PropsWithChildren {
  RfpId:number;
}

export const MultiStepForm = ({ children,RfpId }: Props) => {
  const { form, onAddSubmit, onUpdateSubmit, hasData } =
    useMultiStepForm(CampaignFormContext,RfpId);
  const handleSubmit = hasData ? onUpdateSubmit : onAddSubmit;

  return (
    
    <Form {...form}>
      <form onSubmit={form?.handleSubmit(handleSubmit)}>
        <motion.div
          variants={container}
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="border-none shadow-none">
            <CardContent>
            {children}
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </Form>
  );
};
