/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { containerMultiStepNavbar as container } from "@/framer-motion";
import { motion } from "framer-motion";
import { useMultiStepForm } from "@/hooks/multi-step-form";
import type { Context } from "react";
import type { UseMultiStepFormTypeOptions } from "@/types/multi-step-form";
import {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperTrigger,
  StepperSeparator,
} from "@/components/ui/stepper";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MultiStepNavBarProps<T> extends React.HTMLAttributes<HTMLElement> {
  context: Context<T>;
  defaultValue?: number;
  RfpId: number;
}

function MultiStepNavbar<T extends UseMultiStepFormTypeOptions<any>>({
  context,
  RfpId,
  ...props
}: MultiStepNavBarProps<T>) {
  const { currentStep, setCurrentStep, labels, errors, forms } =
    useMultiStepForm(context, RfpId);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 120;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const hasStepError = (stepIndex: number): boolean => {
    if (stepIndex > currentStep) return false;

    const stepFields = (forms[stepIndex]?.fields || []) as string[];
    return stepFields.some((path) => {
      const keys = path.split(".");
      let current: unknown = errors;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = (current as Record<string, unknown>)[key];
        } else {
          return false;
        }
      }
      return Boolean(current);
    });
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Scroll Left Button */}
      <div className="pointer-events-none z-20 block lg:hidden">
        <button
          onClick={() => scroll("left")}
          className="pointer-events-auto bg-white dark:bg-black shadow rounded-full p-1 mr-2"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-2 scrollbar-hide w-full"
      >
        <div className="flex justify-center">
          <div className="max-w-xl w-full text-center">
            {" "}
            <Stepper
              value={currentStep + 1}
              orientation="horizontal"
              {...props}
             
            >
              {labels.map((label, index) => (
                <StepperItem
                  step={index + 1}
                  key={label}
                  data-state={hasStepError(index)}
                  className="group/step not-last:flex-1 font-bold mx-4"
                  >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative flex items-center">
                        <StepperTrigger
                          className="relative z-10"
                          onClick={() => setCurrentStep(index)}
                        >
                          <StepperIndicator
                            hasError={hasStepError(index)}
                            stepNumber={index + 1}
                          >
                            {index + 1}
                            {currentStep === index && !hasStepError(index) && (
                              <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-[0.15rem] bg-custom-green"
                                layoutId="underline"
                                variants={container}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                              >
                                <StepperSeparator />
                              </motion.div>
                            )}
                          </StepperIndicator>
                        </StepperTrigger>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                </StepperItem>
              ))}
            </Stepper>
          </div>
        </div>
      </div>

      {/* Scroll Right Button */}
      <div className="pointer-events-none z-20 block lg:hidden">
        <button
          onClick={() => scroll("right")}
          className="pointer-events-auto bg-white dark:bg-black shadow rounded-full p-1 ml-2"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default MultiStepNavbar;
