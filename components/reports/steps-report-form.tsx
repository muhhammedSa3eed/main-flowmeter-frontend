'use client';

import { useState } from 'react';
// import { Button } from '@/components/ui/button';
import Stepper from './stepper';
import { Button } from '../ui/button';
import StepOne from './forms-steps/step-1';
import StepTwo from './forms-steps/step-2';
import StepThree from './forms-steps/step-3';
import StepFour from './forms-steps/step-4';
import StepFive from './forms-steps/step-5';
import StepSix from './forms-steps/step-6';
import { useForm } from 'react-hook-form';
import { ReportSchema } from '@/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
const steps = [
  { id: 1, label: 'Primary Metering Device' },
  { id: 2, label: 'Secondary Metering Device' },
  { id: 3, label: 'Data Collection' },
  { id: 4, label: 'In Situ Flow Comparisons' },
  { id: 5, label: 'Overall/ Expanded Uncertainty' },
  { id: 6, label: 'Review & Generate Report' },
];
const StepsReportForm = () => {
  const form = useForm<z.infer<typeof ReportSchema>>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      'Primary Metering Device': {
        'specified uncertainty from manufacturer': {
          'relative uncertainty': 0.02,
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'installation effects': {
          effects_relative_uncertainty_list: [],
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'hydraulic effect': {
          effects_relative_uncertainty_list: [],
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'unsteady flow': {
          'relative uncertainty': 0.02,
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'env temperature effect': {
          opert_temperature_c: 25.0,
          uncert_temperature_c: 0.5,
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
      },
      'Secondary Metering Device': {
        'electronic instrumentation': {
          'relative uncertainty': 0.02,
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'display resolution': {
          'no decimal points': 2,
          'max current output': 20.0,
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'signal conversion': {
          'full flow scale': 5000.0,
          'min current output': 4.0,
          'max current output': 20.0,
          'repeatability error': 0.001,
          'meter accuracy': 0.015,
          'test samples': [
            [0.0, 4.0],
            [856.0, 8.72],
            [858.0, 8.72],
          ],
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
      },
      'Data Collection': {
        'weighted error': {
          'start date': 'yyyy-mm-dd',
          'end date': 'yyyy-mm-dd',
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'data signal conversion': {
          'no decimal points': 2,
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
        'estimates for missing data': {
          'relative uncertainty': 0.02,
          'probability distribution': 'normal',
          'sensitivity coefficient': 1.0,
        },
      },
      'In Situ Flow comparison': {
        'flow reference standard': 0.0,
        'probability distribution': 'normal',
        'sensitivity coefficient': 1.0,
      },
      'coverage probability': 0.95,
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  function onSubmit(values: z.infer<typeof ReportSchema>) {
    console.log('Form Submitted:', JSON.stringify(values));
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6  p-4 h-[calc(100vh-210px)]">
      <Stepper
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <div className="md:col-span-3 lg:col-span-4 bg-white shadow-sm px-2 py-6">
        <div className="flex flex-col">
          <div>
            <div className="flex items-center justify-center gap-4 px-4 py-1">
              <h2 className="mb-3 text-3xl font-bold text-green-500 text-center">
                {steps[currentStep - 1].id}.{steps[currentStep - 1].label}
              </h2>
              <span className="mb-3">
                <Badge variant="secondary">
                  Needs Review <Check size={20} />
                </Badge>
              </span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {currentStep == 1 && <StepOne form={form} />}
                {currentStep == 2 && <StepTwo form={form} />}
                {currentStep == 3 && <StepThree form={form} />}
                {currentStep == 4 && <StepFour form={form} />}
                {currentStep == 5 && <StepFive form={form} />}
                {currentStep == 6 && <StepSix />}

                <div className="flex gap-2 justify-between px-6">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`bg-gray-500 text-gray-100 ${
                      currentStep === 1 && 'bg-muted text-gray-400'
                    } rounded text-base duration-150 hover:bg-gray-600`}
                  >
                    Back
                  </Button>
                  {currentStep === steps.length ? (
                    <Button
                      type="submit"
                      variant="default"
                      className="bg-blue-600 rounded text-base duration-150 hover:bg-blue-600/75"
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      variant="default"
                      className="bg-green-500 rounded text-base duration-150 hover:bg-green-500/75"
                    >
                      Next Step
                    </Button>
                  )}
                  {/* <Button
                    onClick={nextStep}
                    disabled={currentStep === steps.length}
                    variant="default"
                    className="bg-green-500  rounded text-base duration-150 hover:bg-green-500/75 "
                  >
                    Next Step
                  </Button> */}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsReportForm;
