/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { UseMultiStepFormTypeOptions } from '@/types/multi-step-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContext } from 'react';
import { type DefaultValues, type FieldValues, useForm } from 'react-hook-form';
// import type { ZodSchema } from "zod";

export default function buildMultiStepForm<
  T extends FieldValues,
  U extends UseMultiStepFormTypeOptions<T>
>(initialFormOptions: U, schema: any, initialFormData: DefaultValues<T>) {
  const FormContext =
    createContext<UseMultiStepFormTypeOptions<T>>(initialFormOptions);

  const FormProvider: React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {
    const [currentStep, setCurrentStep] = useState(
      initialFormOptions.currentStep
    );

    const form = useForm<T>({
      resolver: zodResolver(schema),
      defaultValues: initialFormData,
    });

    return (
      <FormContext.Provider
        value={{ ...initialFormOptions, setCurrentStep, currentStep, form }}
      >
        {children}
      </FormContext.Provider>
    );
  };

  return {
    FormContext,
    FormProvider,
  };
}
