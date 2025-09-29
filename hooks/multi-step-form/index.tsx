/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { containerCurrentForm as container } from '@/framer-motion';
import type { UseMultiStepFormTypeOptions } from '@/types/multi-step-form';
import { motion } from 'framer-motion';
import {
  type Context,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import type { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Attachment, RfpFormData } from '@/types';
/**
 * Custom hook for managing a multi-step form.
 *
 * @template T - The type of the multi-step form options.
 * @param {Context<T>} context - The React context containing the form state and methods.
 * @returns {Object} An object containing methods and properties for managing the multi-step form.
 * @throws {Error} If the form is not defined in the context.
 */
// biome-ignore lint: must be any as it is a any object
function useMultiStepForm<T extends UseMultiStepFormTypeOptions<any>>(
  context: Context<T>,
  RfpId: number,
  token?: string
) {
  const { forms, schema, currentStep, setCurrentStep, form, saveFormData } =
    useContext(context);
  // console.log(forms)
  if (form === undefined) throw new Error('A react-hook-form must be defined');

  const steps = forms.length;

  /**
   * Advances to the next step if not already at the last step.
   */

  const nextStep = () => {
    if (currentStep < steps - 1) setCurrentStep((step) => step + 1);
  };

  /**
   * Goes back to the previous step if not already at the first step.
   */
  const previousStep = () => {
    if (currentStep > 0) setCurrentStep((step) => step - 1);
  };

  /**
   * Goes to a specific step.
   *
   * @param {number} index - The index of the step to go to.
   */
  const goToStep = (index: number) => {
    if (index >= 0 && index < steps) setCurrentStep((step) => index);
  };

  /**
   * Checks if the current step is the first step.
   *
   * @returns {boolean} True if the current step is the first step, false otherwise.
   */
  const isFirstStep = currentStep === 0;

  /**
   * Checks if the current step is the last step.
   *
   * @returns {boolean} True if the current step is the last step, false otherwise.
   */
  const isLastStep = currentStep === steps - 1;

  /**
   * Get the current step label.
   *
   * @returns {string} The current step label.
   */
  const currentStepLabel = forms[currentStep].label;

  /**
   * Handles form submission.
   *
   * @param {z.infer<typeof schema>} values - The form values.
   */
  const [hasData, setHasData] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const fetchedRef = useRef(false);

  // useEffect(() => {
  //   console.log('from client', { token });
  // }, []);
  useEffect(() => {
    if (!RfpId || RfpId === 0) return;

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const token = Cookies.get('token');

    const fetchRFPValues = async () => {
      console.log('useMultiStepForm called with RfpId:', RfpId);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/${RfpId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setHasExistingData(false);
            setHasData(false);
            return;
          }
          throw new Error('Fetch failed');
        }

        const data = await response.json();

        if (data?.error === 'not_found') {
          setHasExistingData(false);
          setHasData(false);
          return;
        }

        const initialValues: RfpFormData = {
          BasicInformation: {
            typeOfRfp: data.typeOfRfp ?? '',
            rfpReference: data.RfpReference ?? '',
          },
          GeneralInfo: {
            rfpNo: data.RfpReference ?? '',
            licensee: data.generalInfo?.licensee ?? '',
            address: data.generalInfo?.address ?? '',
            contactNumber: data.generalInfo?.contactNumber ?? '',
            faxNumber: data.generalInfo?.faxNumber ?? '',
            reportDate: data.generalInfo?.reportDate ?? '',
            reportRef: data.generalInfo?.reportRef ?? '',
            responsiblePosition: data.generalInfo?.responsiblePosition ?? '',
            responsibleDepartment:
              data.generalInfo?.responsibleDepartment ?? '',
            fmIdScada: data.generalInfo?.fmIdScada ?? '',
            fmIdSwsAssetNo: data.generalInfo?.fmIdSwsAssetNo ?? '',
            siteManagerName: data.generalInfo?.siteManagerName ?? '',
            locationType: data.LocationType?.type ?? '',
          },
          approvalDetails: {
            approvalExpiry: data?.approvalDetails?.approvalExpiry || 'N/A',
            approvedReapplication:
              data?.approvalDetails?.approvedReapplication || 'N/A',
            appealApplication:
              data?.approvalDetails?.appealApplication || 'N/A',
            appealExtensionApplication:
              data?.approvalDetails?.appealExtensionApplication || 'N/A',
            appealExtensionDecision:
              data?.approvalDetails?.appealExtensionDecision || 'N/A',
            panelAppealMeeting:
              data?.approvalDetails?.panelAppealMeeting || 'N/A',
            panelAppealDecisionDate:
              data?.approvalDetails?.panelAppealDecisionDate || 'N/A',
            doeAppealDecisionDate:
              data?.approvalDetails?.doeAppealDecisionDate || 'N/A',
            panelAppealFinalResult:
              data?.approvalDetails?.panelAppealFinalResult || 'N/A',
          },
          MonitoringDetails: {
            location: {
              region: data.location?.region ?? '',
              stpcc: data.location?.stpcc ?? '',
              description: data.location?.description ?? '',
              coordinateN: data.location?.coordinateN ?? 0,
              coordinateE: data.location?.coordinateE ?? 0,
              siteDrawingRef: data.location?.siteDrawingRef ?? '',
              flowDiagramRef: data.location?.flowDiagramRef ?? '',
            },
          },
          FlowmeterDetails: {
            flowMonitoring: {
              flowDiagramRef: data.location?.flowDiagramRef ?? '',
              meterInstallDate:
                data.flowRegister?.installation?.meterInstallDate ?? '',
              meterRemovalDate:
                data.flowRegister?.installation?.meterRemovalDate ?? '',
              selectedOption: data.flowMeasurement?.selectedOption ?? '',
            },
          },
          FlowmeterInventory: {
            inventory: {
              make: data.flowRegister?.inventory?.make ?? '',
              type: data.flowRegister?.inventory?.type ?? '',
              model: data.flowRegister?.inventory?.model ?? '',
              serial: data.flowRegister?.inventory?.serial ?? '',
              fmSize: data.flowRegister?.inventory?.fmSize ?? '',
              pipelineSize: data.flowRegister?.inventory?.pipelineSize ?? '',
              velocityRange: data.flowRegister?.inventory?.velocityRange ?? '',
              accuracyReading:
                data.flowRegister?.inventory?.accuracyReading ?? '',
              accuracyFullScale:
                data.flowRegister?.inventory?.accuracyFullScale ?? '',
              readingMethod: data.flowRegister?.inventory?.readingMethod ?? '',
            },
          },
          FlowmeterInstallationMaintenance: {
            installation: {
              hydraulicUpstream:
                data.flowRegister?.installation?.hydraulicUpstream ?? '',
              hydraulicDownstream:
                data.flowRegister?.installation?.hydraulicDownstream ?? '',
              environmental:
                data.flowRegister?.installation?.environmental ?? '',
              onSiteTesting:
                data.flowRegister?.installation?.onSiteTesting ?? '',
              safetyRisks: data.flowRegister?.installation?.safetyRisks ?? '',
              securityOfLocation:
                data.flowRegister?.installation?.securityOfLocation ?? '',
            },
            maintenance: {
              maintenanceRef:
                data.flowRegister?.maintenance?.maintenanceRef ?? false,
              preventativeScheduleRef:
                data.flowRegister?.maintenance?.preventativeScheduleRef ??
                false,
            },
          },
          maf: {
            detail: data.maf?.detail ?? '',
            sopRef: data.maf?.sopRef ?? '',
            selectionSummary: data.maf?.selectionSummary ?? '',
            id: data.maf?.id ?? 0,
            rfpId: data.maf?.rfpId ?? 0,
          },
          DataCollectionExchange: {
            startDate: data.startDate ?? '',
            completionDate: data.completionDate ?? '',
            data: {
              manualMethod: data.data?.manualMethod ?? '',
              dataLogger: data.data?.dataLogger ?? '',
              remoteReading: data.data?.remoteReading ?? '',
              outstationDetails: data.data?.outstationDetails ?? '',
              storageDetails: data.data?.storageDetails ?? '',
              ubReport: data.data?.ubReport ?? '',
              ubValue: data.data?.ubValue ?? '',
              dataManagementProcedure: data.data?.dataManagementProcedure ?? '',
            },
          },
          attachments: [
            {
              CollaborationCertificate:
                data.attachments?.CollaborationCertificate?.[0] || '',
              AnotherFile: data.attachments?.AnotherFile || [],
              FlowMeterImages: data.attachments?.FlowMeterImages || [],
            },
          ],
          rfpId: 0,
          id: 0,
        };

        // ✅ Extract and apply filename_download metadata
        const { attachmentMeta = {} } = data;
        const mapped: Record<string, any> = {};
        Object.entries(attachmentMeta).forEach(([id, filename]) => {
          mapped[id] = {
            id,
            filename_download: filename,
            type: '',
            size: 0,
          };
        });

        console.log('Fetched data:', initialValues);
        form.reset({
          ...initialValues,
          attachmentMeta: data.attachmentMeta ?? {},
        });
        setHasExistingData(true);
        setHasData(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasExistingData(false);
        setHasData(false);
      }
    };

    fetchRFPValues();
  }, [RfpId]);

  const router = useRouter();
  const onAddSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
    console.log({ token });
    console.log('values:', JSON.stringify(values));

    if (isLastStep) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
              // Authorization: token
              //   ? `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA5YmExMDEzLTIyNTUtNDdkYi1iOTllLWViNmI3M2Q3ZDI0ZiIsImVtYWlsIjoid2FsYWFlbWFtMDc3QGdtYWlsLmNvbSIsImdyb3VwIjoiU3VwZXJBZG1pbiIsImlhdCI6MTc1ODE3NzQ1MiwiZXhwIjoxNzU4MTc4MzUyfQ.8cDTbKBOxJ3begYeV0zlnZJOCZ5RBg4s0Cn_9pOfAyI`
              //   : '',
            },
            body: JSON.stringify(values),
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.log('errorData?.error:', errorData?.error);
          const errorMessage = errorData?.error || 'Failed to save Flow-meter';
          toast.error(` ${errorMessage}`);
          return;
        }

        const data = await response.json();

        toast.success('✅ Flow-meter has been saved successfully.');
        router.push('/dashboard/Rfp-Compliance');
      } catch (error) {
        toast.error('❌ Failed to save Flow-meter.');
      }
    }

    nextStep();
  };

  const onUpdateSubmit: SubmitHandler<z.infer<typeof schema>> = async (
    values
  ) => {
    const token = Cookies.get('token');

    // console.log("values:", values);
    if (isLastStep) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/rfp/${RfpId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(values),
            credentials: 'include',
          }
        );

        if (!response.ok) {
          toast.error('Failed to Update  Flow-meter');
          return;
        }

        const data = await response.json();
        // console.log("Settings Updated successfully:", data);
        toast.success(' Flow-meter have been Updated successfully.');
        router.push('/dashboard/Rfp-Compliance');
      } catch (error) {
        toast.error('Failed to Update Flow-meter.');
      }
    }

    nextStep();
  };

  /**
   * Handles form submission errors by checking if there are errors
   * in the current step's fields and navigating to the next step if there are none.
   *
   * @template T - The type of the form field values.
   *
   * @param {SubmitErrorHandler<z.infer<typeof schema>>} errors - The form submission errors.
   *
   * @returns {void}
   */
  const onErrors: SubmitErrorHandler<z.infer<typeof schema>> = (errors) => {
    const stepFields = forms[currentStep].fields.flat();
    const errorFields = new Set(Object.keys(errors).flat());

    let hasStepErrors = false;
    for (const field of stepFields) {
      if (errorFields.has(field as string)) hasStepErrors = true;
    }

    if (!hasStepErrors) {
      form?.clearErrors();
      nextStep();
    }
  };

  /**
   * Create a string array of labels
   *
   * @returns {string[]} string array of labels
   */
  const labels = forms.map((form) => form.label);

  const CurrentForm: React.FC = useCallback(() => {
    const Step = forms[currentStep].form;
    return (
      <motion.div
        variants={container}
        className="flex flex-col gap-2"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Step />
      </motion.div>
    );
  }, [forms, currentStep]);

  return {
    form,
    currentStep,
    setCurrentStep,
    steps,
    nextStep,
    previousStep,
    goToStep,
    isFirstStep,
    isLastStep,
    labels,
    currentStepLabel,
    CurrentForm,
    onAddSubmit,
    onUpdateSubmit,
    hasData,
    onErrors,
    errors: form.formState.errors,
    forms,
    // stepErrors,
    RfpId,
  };
}

export { useMultiStepForm };
