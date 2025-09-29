'use client';

import { Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
type Steps = {
  id: number;
  label: string;
};
interface StepHook {
  steps: Steps[];
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
}
const Stepper = ({ steps, currentStep, setCurrentStep }: StepHook) => {
  return (
    <div className=" flex-col space-y-12 hidden md:flex md:col-span-2  justify-center">
      {steps.map((step, selected) => (
        <div key={step.id} className="relative flex items-center space-x-4">
          {selected !== steps.length - 1 && (
            <div
              className={`absolute left-[18px] top-9 w-[2px] h-[50px] bg-muted`}
            />
          )}

          <Button
            variant="ghost"
            onClick={() => setCurrentStep(step.id)}
            className="flex items-center space-x-4 p-0 h-auto hover:bg-transparent cursor-pointer"
          >
            <div
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-full border text-sm font-semibold relative z-10 transition-colors ',
                currentStep === step.id
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-muted text-muted-foreground border-muted-foreground/30'
              )}
            >
              {step.id}
            </div>

            <span
              className={cn(
                'text-base transition-colors',
                currentStep === step.id
                  ? 'text-green-500 font-medium'
                  : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
