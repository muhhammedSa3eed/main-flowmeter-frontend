/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMultiStepForm } from "@/hooks/multi-step-form";
import type { Context } from "react";
import type { UseMultiStepFormTypeOptions } from "@/types/multi-step-form";

interface MultiStepNavButtonsProps<T> {
  previousLabel: string;
  nextLabel: string;
  endStepCreateLabel: string;
  endStepUpdateLabel: string;
  context: Context<T>;
  debug?: boolean;
  RfpId: number;
}
function MultiStepNavButtons<T extends UseMultiStepFormTypeOptions<any>>({
  previousLabel,
  nextLabel,
  endStepCreateLabel,
  endStepUpdateLabel,
  debug = false,
  context,
  RfpId,
}: MultiStepNavButtonsProps<T>) {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    hasData,
    previousStep,
    form,
    onAddSubmit,
    onUpdateSubmit,
    onErrors,
  } = useMultiStepForm(context, RfpId);


  const handleDynamicSubmit = () => {
    form.handleSubmit((values) => {
      if (hasData) {
        onUpdateSubmit(values);
      } else {
        onAddSubmit(values);
      }
    }, onErrors)();
  };
  return (
    <div className="flex flex-row w-full justify-between mt-4">
      {debug && (
        <pre className="flex justify-center items-center absolute w-32 h-32 right-2 bottom-2 bg-yellow-400 text-black text-sm border-2 rounded-md">{`Current Step: ${currentStep}`}</pre>
      )}
      <Button
        variant={"default"}
        size={"custom"}
        onClick={() => {
          previousStep();
        }}
        type="button"
        className={cn(`${isFirstStep ? "invisible" : "visible"}`)}
      >
        {previousLabel}
      </Button>

      <Button
        variant={isLastStep && hasData ? "edit" : "custom"}
        size={"custom"}
        type="button"
        onClick={handleDynamicSubmit}
      >
        {isLastStep
          ? hasData
            ? endStepUpdateLabel
            : endStepCreateLabel
          : nextLabel}
      </Button>
    </div>
  );
}

export default MultiStepNavButtons;
