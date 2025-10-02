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
interface searchStepData {
  token?: string;
  rfpIdData?: number | undefined;
}
const StepsReportForm = ({ token, rfpIdData }: searchStepData) => {
  const form = useForm<z.infer<typeof ReportSchema>>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      primaryMeteringDevice: {
        specifiedUncertainty: {
          relativeUncertainty: 0.02,
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        installationEffects: {
          effectsRelativeUncertaintyList: [],
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        hydraulicEffect: {
          effectsRelativeUncertaintyList: [],
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        unsteadyFlow: {
          relativeUncertainty: 0.02,
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        envTemperatureEffect: {
          opertTemperatureC: 25.0,
          uncertTemperatureC: 0.5,
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
      },
      secondaryMeteringDevice: {
        electronicInstrumentation: {
          relativeUncertainty: 0.02,
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        displayResolution: {
          noDecimalPoints: 2,
          maxCurrentOutput: 20.0,
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        signalConversion: {
          fullFlowScale: 5000.0,
          minCurrentOutput: 4.0,
          maxCurrentOutput: 20.0,
          repeatabilityError: 0.001,
          meterAccuracy: 0.015,
          testSamples: [
            [0.0, 4.0],
            [856.0, 8.72],
            [858.0, 8.72],
          ],
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
      },
      // "2025-09-01"
      // "2025-09-28"
      dataCollection: {
        weightedError: {
          startDate: '',
          // startDate: '2025-09-30',
          // endDate: 'yyyy-mm-dd',
          diameter: 'diameter',
          // endDate: '',
          endDate: '',

          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        dataSignalConversion: {
          noDecimalPoints: undefined,
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
        estimatesForMissingData: {
          relativeUncertainty: 0.02,
          probabilityDistribution: 'normal',
          sensitivityCoefficient: 1.0,
        },
      },
      inSituFlowComparison: {
        flowReferenceStandard: 0.0,
        probabilityDistribution: 'normal',
        sensitivityCoefficient: 1.0,
      },
      coverageProbability: 0.95,
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
  async function onSubmit(values: z.infer<typeof ReportSchema>) {
    console.log(JSON.stringify(values));
    console.log({ token });
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify({
            title: 'Report',
            rfpId: rfpIdData,
            ...values,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to submit report');
      }

      const data = await res.json();

      console.log('Report created successfully:', data);

      return data;
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  }
  // async function onSubmit(values: z.infer<typeof ReportSchema>) {
  //   console.log('Form Submitted:', JSON.stringify(values));
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //         credentials: 'include',

  //         body: JSON.stringify({
  //           ...values,
  //           title: 'Industrial Flow Monitoring Report - Site',
  //           coverageProbability: 0.98,
  //           rfpId: 4,
  //         }),
  //       }
  //     );

  //     if (!res.ok) {
  //       throw new Error('Failed to submit report');
  //     }

  //     const data = await res.json();
  //     console.log('Report created successfully:', data);
  //   } catch (error) {
  //     console.error('Error submitting report:', error);
  //   }
  // }
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
                // onSubmit={form.handleSubmit(onSubmit)}
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
                    type="button"
                    disabled={currentStep === 1}
                    className={`bg-gray-500 text-gray-100 ${
                      currentStep === 1 && 'bg-muted text-gray-400'
                    } rounded text-base duration-150 hover:bg-gray-600`}
                  >
                    Back
                  </Button>
                  {currentStep === steps.length ? (
                    <Button
                      type="button"
                      onClick={form.handleSubmit(onSubmit)}
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
