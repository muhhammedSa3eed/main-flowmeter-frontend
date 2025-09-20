import type {
  Form,
  UseMultiStepFormTypeOptions,
} from '@/types/multi-step-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import buildMultiStepForm from '@/lib/multi-step-form';
import { Step2 } from './step-2';
import { Step3 } from './step-3';
import { Step4 } from './step-4';
import { Step5 } from './step-5';
import { Step6 } from './step-6';
import { Step7 } from './step-7';
import { Step8 } from './step-8';
import { Step1 } from './step-1';
import { RfpSchema } from '@/schemas';
import { Step9 } from './step-9';
import { Step10 } from './step-10';

// 2 - create the type
export type RfpFormData = z.infer<typeof RfpSchema>;

// 3 - Initial Data for fields
export const initialFormData: RfpFormData = {
  BasicInformation: {
    typeOfRfp: '',
    rfpReference: '',
  },
  GeneralInfo: {
    licensee: '',
    address: '',
    contactNumber: 0,
    reportRef: '',
    rfpNo: '',
    faxNumber: 0,
    reportDate: '',
    responsiblePosition: '',
    responsibleDepartment: '',
    fmIdScada: '',
    fmIdSwsAssetNo: '',
    siteManagerName: '',
    locationType: '',
  },

  approvalDetails: {
    approvalExpiry: '',
    approvedReapplication: '',
    appealApplication: '',
    appealExtensionApplication: '',
    appealExtensionDecision: '',
    panelAppealMeeting: '',
    panelAppealDecisionDate: '',
    doeAppealDecisionDate: '',
    panelAppealFinalResult: '',
  },

  MonitoringDetails: {
    location: {
      region: '',
      stpcc: '',
      description: '',
      coordinateN: 0,
      coordinateE: 0,
      siteDrawingRef: '',
    },
  },
  FlowmeterDetails: {
    flowMonitoring: {
      flowDiagramRef: '',
      meterInstallDate: '',
      meterRemovalDate: '',
      selectedOption: '',
    },
  },
  FlowmeterInventory: {
    inventory: {
      make: '',
      type: '',
      model: '',
      serial: '',
      fmSize: '',
      pipelineSize: '',
      velocityRange: '',
      accuracyReading: '',
      accuracyFullScale: '',
      readingMethod: '',
    },
  },
  FlowmeterInstallationMaintenance: {
    installation: {
      hydraulicUpstream: '',
      hydraulicDownstream: '',
      environmental: '',
      onSiteTesting: '',
      safetyRisks: '',
      securityOfLocation: '',
    },
    maintenance: {
      maintenanceRef: false,
      preventativeScheduleRef: false,
    },
  },
  DataCollectionExchange: {
    completionDate: '',
    startDate: '',
    data: {
      manualMethod: '',
      dataLogger: '',
      remoteReading: '',
      outstationDetails: '',
      storageDetails: '',
      ubReport: '',
      ubValue: '',
      dataManagementProcedure: '',
    },
  },
  maf: {
    detail: '',
    sopRef: '',
    selectionSummary: '',
  },

  attachments: [
    {
      CollaborationCertificate: '',
      AnotherFile: [],
      FlowMeterImages: [],
    },
  ],
};

const saveFormData: SubmitHandler<RfpFormData> = async (values) => {
  console.log(values);
};

// 5 - Define the steps and sub-forms and each field for step
export const forms: Form<RfpFormData>[] = [
  {
    id: 0,
    label: 'Basic Information',
    form: Step1,
    fields: ['BasicInformation'],
  },
  { id: 1, label: 'General Info', form: Step2, fields: ['GeneralInfo'] },
  {
    id: 2,
    label: 'Location & Measurement',
    form: Step3,
    fields: ['approvalDetails'],
  },
  {
    id: 3,
    label: 'Monitoring Details',
    form: Step4,
    fields: ['MonitoringDetails'],
  },
  {
    id: 4,
    label: 'Flowmeter Details',
    form: Step5,
    fields: ['FlowmeterDetails'],
  },
  {
    id: 5,
    label: 'Flowmeter Inventory',
    form: Step6,
    fields: ['FlowmeterInventory'],
  },
  {
    id: 6,
    label: 'Flowmeter Installation & Maintenance',
    form: Step7,
    fields: ['FlowmeterInstallationMaintenance'],
  },
  {
    id: 7,
    label: 'Data Collection & Exchange',
    form: Step8,
    fields: ['DataCollectionExchange'],
  },
  {
    id: 8,
    label: 'Metrological Assurance Framework (MAF) & RFP Conditions',
    form: Step9,
    fields: ['maf'],
  },
  {
    id: 9,
    label: 'Attachments',
    form: Step10,
    fields: ['attachments'],
  },
];

// 6 - Define initial Form Options
const initialFormOptions: UseMultiStepFormTypeOptions<RfpFormData> = {
  schema: RfpSchema,
  currentStep: 0,
  setCurrentStep: () => {},
  forms,
  saveFormData,
};
// 7 - Build the Context and Provider
const { FormContext, FormProvider } = buildMultiStepForm(
  initialFormOptions,
  RfpSchema,
  initialFormData
);

// 6. Export once and reuse
export const CampaignFormContext = FormContext;
export const CampaignProvider = FormProvider;
