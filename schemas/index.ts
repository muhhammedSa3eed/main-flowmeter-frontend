import { z } from 'zod';

const MaintenanceSchema = z.object({
  maintenanceRef: z.boolean(),
  preventativeScheduleRef: z.boolean(),
});
const InventorySchema = z.object({
  make: z.string().min(1, 'Make is required'),
  type: z.string().min(1, 'Type is required'),
  model: z.string().min(1, 'Model is required'),
  serial: z.string().min(1, 'Serial is required'),
  fmSize: z.string().min(1, 'FM Size is required'),
  pipelineSize: z.string().min(1, 'Pipeline Size is required'),
  velocityRange: z.string().min(1, 'Velocity Range is required'),
  accuracyReading: z.string().min(1, 'Accuracy Reading is required'),
  accuracyFullScale: z.string().min(1, 'Accuracy Full Scale is required'),
  readingMethod: z.string().min(1, 'Reading Method is required'),
});
const InstallationSchema = z.object({
  hydraulicUpstream: z.string().min(1, 'Required'),
  hydraulicDownstream: z.string().min(1, 'Required'),
  environmental: z.string().min(1, 'Required'),
  onSiteTesting: z.string().min(1, 'Required'),
  safetyRisks: z.string().min(1, 'Required'),
  securityOfLocation: z.string().min(1, 'Required'),
});
const stepOneSchema = z.object({
  typeOfRfp: z.string().min(1, 'RFP Type is required'),
  rfpReference: z.string().min(1, 'RFP Reference is required'),
});
const stepTwoSchema = z.object({
  rfpNo: z.string().min(1, 'rfpNo is required'),
  licensee: z.string().min(1, 'Licensee is required'),
  address: z.string().min(1, 'Address is required'),
  contactNumber: z.coerce.number().min(1, 'Contact number is required'),
  faxNumber: z.coerce.number().optional(),
  // faxNumber: z.coerce.number().min(1, 'fax Number is required'),
  reportDate: z.string().min(1, 'Report Date is required'),
  reportRef: z.string().min(1, 'Report Reference is required'),
  responsiblePosition: z.string().min(1, 'Responsible Position is required'),
  responsibleDepartment: z
    .string()
    .min(1, 'Responsible Department is required'),
  fmIdScada: z.string().min(1, 'Scada ID is required'),
  fmIdSwsAssetNo: z.string().min(1, 'Sws Asset No is required'),
  siteManagerName: z.string().min(1, 'Site Manager Name is required'),
  locationType: z.string().min(1, 'Location Type is required'),
});

const stepThreeSchema = z.object({
  approvalExpiry: z.string().min(1, 'Approval Expiry is required'),
  approvedReapplication: z
    .string()
    .min(1, 'Approved Reapplication is required'),
  appealApplication: z.string().min(1, 'Appeal Application is required'),
  appealExtensionApplication: z
    .string()
    .min(1, 'Appeal Extension Application is required'),
  appealExtensionDecision: z
    .string()
    .min(1, 'Appeal Extension Decision is required'),
  panelAppealMeeting: z.string().min(1, 'Panel Appeal Meeting is required'),
  panelAppealDecisionDate: z
    .string()
    .min(1, 'Panel Appeal DecisionDate is required'),
  doeAppealDecisionDate: z
    .string()
    .min(1, 'Doe Appeal Decision Date is required'),
  panelAppealFinalResult: z
    .string()
    .min(1, 'Panel Appeal Final Result is required'),
});

const stepFourSchema = z.object({
  location: z.object({
    region: z.string().min(1, 'Region is required'),
    stpcc: z.string().min(1, 'Stpcc is required'),
    description: z.string().min(1, 'Description is required'),
    coordinateN: z.number().min(1, 'Coordinate N is required'),
    coordinateE: z.number().min(1, 'Coordinate E is required'),
    siteDrawingRef: z.string().min(1, 'Site Drawing Reference is required'),
    // flowDiagramRef: z.string().min(1, 'Flow Diagram Reference is required'),
   
  }),
});

const stepFiveSchema = z.object({
  flowMonitoring: z.object({
    flowDiagramRef: z.string().min(1, 'flow Diagram Reference is required'),
    meterInstallDate: z.string().min(1, 'Meter install date is required'),
    meterRemovalDate: z.string().min(1, 'Meter removal date is required'),
    selectedOption: z.string().min(1, 'Selected option is required'),
  }),
});

const stepSixSchema = z.object({
  inventory: InventorySchema,
});

const stepSevenSchema = z.object({
  installation: InstallationSchema,
  maintenance: MaintenanceSchema,
});

const stepEightSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  completionDate: z.string().min(1, 'Completion date is required'),

  data: z.object({
    manualMethod: z.string().min(1, 'Manual method is required'),
    dataLogger: z.string().min(1, 'Data logger is required'),
    remoteReading: z.string().min(1, 'Remote reading is required'),
    outstationDetails: z.string().min(1, 'Outstation details are required'),
    storageDetails: z.string().min(1, 'Storage details are required'),
    ubReport: z.string().min(1, 'UB report is required'),
    ubValue: z.string().min(1, 'UB value is required'),
    dataManagementProcedure: z
      .string()
      .min(1, 'Data management procedure is required'),
  }),
});
const stepNineSchema = z.object({
  detail: z.string().min(1, 'Detail is required'),
  sopRef: z.string().min(1, 'SOP ref is required'),
  selectionSummary: z.string().min(1, 'Selection summary is required'),
});

const stepTenSchema = z.array(
  z.object({
    CollaborationCertificate: z
      .string()
      .min(1, 'Collaboration Certificate  is required'),
    AnotherFile: z.array(z.string()).min(1, 'At least one File is required'),
    FlowMeterImages: z
      .array(z.string())
      .min(1, 'At least one Images is required'),
  })
);
export const RfpSchema = z.object({
  BasicInformation: stepOneSchema,
  GeneralInfo: stepTwoSchema,
  approvalDetails: stepThreeSchema,
  MonitoringDetails: stepFourSchema,
  FlowmeterDetails: stepFiveSchema,
  FlowmeterInventory: stepSixSchema,
  FlowmeterInstallationMaintenance: stepSevenSchema,
  DataCollectionExchange: stepEightSchema,
  maf: stepNineSchema,
  attachments: stepTenSchema,
});
export {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  stepFiveSchema,
  stepSixSchema,
  stepSevenSchema,
  stepEightSchema,
  stepNineSchema,
  stepTenSchema,
};
export const AttachmentSchema = z.object({
  id: z.string(),
  typeOfAttachment: z.string(),
});

export const ConnectionSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    type: z.string().min(1, 'Data type is required'),
    polling: z.number().min(1, 'polling is required'),
    enabled: z.boolean(),
    property: z.object({
      dbType: z.string().optional(),
      databaseName: z.string().optional(),
      method: z.string().optional(),
      format: z.string().optional(),
      address: z.string().optional(),
      ip: z.string().optional(),
      dsn: z.string().optional(),
      port: z.number().optional(),
      host: z.string().optional(),
      user: z.string().optional(),
      password: z.string().optional(),
      tableName: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    const { type, property } = data;

    if (type === 'ODBC') {
      if (!property.dsn || property.dsn.trim() === '') {
        ctx.addIssue({
          path: ['property', 'dsn'],
          code: z.ZodIssueCode.custom,
          message: 'DSN is required for ODBC',
        });
      }
    }

    if (type === 'WebAPI') {
      const requiredFields = ['method', 'format', 'address'] as const;
      requiredFields.forEach((f) => {
        const val = property[f];
        if (!val || val.trim() === '') {
          ctx.addIssue({
            path: ['property', f],
            code: z.ZodIssueCode.custom,
            message: `${f} is required for WebAPI`,
          });
        }
      });
    }

    if (type === 'Database') {
      const requiredFields = [
        'databaseName',
        'host',
        'user',
        'password',
        'dbType',
      ] as const;

      requiredFields.forEach((f) => {
        const val = property[f];
        if (!val || val.trim() === '') {
          ctx.addIssue({
            path: ['property', f],
            code: z.ZodIssueCode.custom,
            message: `${f} is required for Database`,
          });
        }
      });

      if (
        property.port === undefined ||
        typeof property.port !== 'number' ||
        property.port <= 0
      ) {
        ctx.addIssue({
          path: ['property', 'port'],
          code: z.ZodIssueCode.custom,
          message: 'Port is required for Database',
        });
      }
    }
  });

export const AddProjectSchema = z.object({
  name: z.string().max(50).min(1, { message: 'Name is required' }),
  description: z
    .string()
    .max(1000)
    .min(1, { message: 'Description is required' }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: ' email is required' }),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});
export const ViewSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name cannot exceed 50 characters' }),

  description: z
    .string()
    .max(5000, { message: 'Description cannot exceed 5000 characters' })
    .optional(),

  // Allow both string and number, transforming strings to numbers
  width: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
    .refine((val) => !val || val >= 0, {
      message: 'Width must be a positive number',
    })
    .optional(),

  height: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === 'string' ? parseFloat(val) : val))
    .refine((val) => !val || val >= 0, {
      message: 'Height must be a positive number',
    })
    .optional(),

  backgroundColor: z.string().optional(),
  gridType: z.string().optional(),
});

export const UserSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'A valid email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  group: z.string().min(1),
});
export const GroupSchema = z.object({
  name: z.string().min(1, { message: 'Group name is required' }),
  permissions: z.array(
    z.object({
      tableName: z.string(),
      canCreate: z.boolean().optional(),
      canRead: z.boolean().optional(),
      canUpdate: z.boolean().optional(),
      canDelete: z.boolean().optional(),
    })
  ),
});
export const EditUserSchema = z.object({
  status: z.string().min(1, { message: 'status is required' }),
  group: z.string().min(1, { message: 'group is required' }),
});
export const SignUpSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'A valid email is required' }),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

export const EditProfileSchema = z.object({
  name: z.string().min(1, { message: 'name is required' }),
  info: z.string().optional(),
  group: z.string().min(1, { message: 'group is required' }),
});

export const InviteSchema = z.object({
  email: z.string().email({ message: 'A valid email is required' }),
});

export const SendOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});
export const VerifyOtpSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  otp: z.string().min(1, { message: 'otp is required' }),
});
