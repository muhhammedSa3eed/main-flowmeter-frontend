export interface RfpFormData {
  rfpId: number;
  id: number;
  BasicInformation: {
    typeOfRfp: string;
    rfpReference: string;
  };
  GeneralInfo: {
    rfpNo?: string;
    licensee: string;
    address: string;
    contactNumber: string;
    faxNumber?: string;
    reportDate?: string;
    reportRef: string;
    responsiblePosition?: string;
    responsibleDepartment?: string;
    fmIdScada?: string;
    fmIdSwsAssetNo?: string;
    siteManagerName?: string;
    locationType: string;
  };
 
    approvalDetails: {
      approvalExpiry: string;
      approvedReapplication: string;
      appealApplication: string;
      appealExtensionApplication: string;
      appealExtensionDecision: string;
      panelAppealMeeting: string;
      panelAppealDecisionDate: string;
      doeAppealDecisionDate: string;
      panelAppealFinalResult: string;
    };
  MonitoringDetails: {
    location: {
      region: string;
      stpcc: string;
      description: string;
      coordinateN?: number;
      coordinateE?: number;
      siteDrawingRef: string;
      flowDiagramRef: string;
    };
  };
  FlowmeterDetails: {
    flowMonitoring: {
      flowDiagramRef: string;
      meterInstallDate: string;
      meterRemovalDate: string;
      selectedOption: string;
    };
  };
  FlowmeterInventory: {
    inventory: {
      make: string;
      type: string;
      model: string;
      serial: string;
      fmSize: string;
      pipelineSize: string;
      velocityRange: string;
      accuracyReading: string;
      accuracyFullScale: string;
      readingMethod: string;
    };
  };
  FlowmeterInstallationMaintenance: {
    installation: {
      hydraulicUpstream: string;
      hydraulicDownstream: string;
      environmental: string;
      onSiteTesting: string;
      safetyRisks: string;
      securityOfLocation: string;
    };
    maintenance: {
      maintenanceRef: boolean;
      preventativeScheduleRef: boolean;
    };
  };
  maf: {
    detail: string;
    sopRef: string;
    selectionSummary: string;
    id?: number;
    rfpId?: number;
  };
  DataCollectionExchange: {
    startDate: string;
    completionDate: string;
    data: {
      manualMethod: string;
      dataLogger: string;
      remoteReading: string;
      outstationDetails: string;
      storageDetails: string;
      ubReport: string;
      ubValue: string;
      dataManagementProcedure: string;
    };
  };
  attachments: [
    {
      CollaborationCertificate:string;
      AnotherFile:[];
      FlowMeterImages:[];

    }
  ];
}

export interface Attachment {
  id: string;
  rfpId: number;
  type: string;
  typeOfAttachment:string;
  filePath: string;
  filename_disk: string;
  filename_download: string;
  folderId: string | null;
  folderPath: string | null;
  uploadedAt: string;
  createdAt: string;
  title: string | null;
  description: string | null;
  location: string | null;
  tags: string[] | null;
  width: number | null;
  height: number | null;
  duration: number | null;
  filesize: number;
  updatedById: string | null;
  uploaderId: string | null;
}



export interface RfpDateField {
  name: string; // Allow nested paths
  label: string;
  type?: string;
}



export type Devices = {
  id: string;
  enabled: boolean;
  name: string;
  type: string;
  description?: string;
  property: {
    address: string;
    method: string;
    format: string;
    ip: string;
    port: number;
    host: number;
    DSN:string;
    SQLAlchemyURL: string;
    user: string;
    password: string;
  };
  polling: number;
  lastConnected: string;
};
export type SelectType = {
  id: number;
  title: string;
  value: string;
};

export type SelectPolling = {
  id: number;
  title: string;
  value: number;
};
export type databaseType = {
  property: {
    databaseType: string;
    host: number;
    port: number;
    DSN: string;
    username: string;
    password: string;
  };
};
export type WebAPI = {
  property: {
    method: string;
    format: string;
    address: string;
  };
};

export type DeviceDB = {
  id:string
  name: string,
  description: string,
  type: string,
  property: {
    dbType:string;
    databaseName: string,
    method: string,
    format: string,
    address: string,
    ip: string,
    port: number,
    host: string,
    DSN:string;
    user: string,
    password: string,
  },

  polling: number,
  enabled: boolean,
};
export type DashboardStats = {
  rfpCount: number
  userCount: number
  connectionCount: number
}
////////////////////////////////////////

export type ApprovalDetails = {
  id: number;
  rfpId: number;
  approvalExpiry: string;
  approvedReapplication: string;
  appealApplication: string;
  appealExtensionApplication: string;
  appealExtensionDecision: string;
  panelAppealMeeting: string;
  panelAppealDecisionDate: string;
  doeAppealDecisionDate: string;
  panelAppealFinalResult: string;
};
export type MAF = {
  id: number;
  rfpId: number;
  detail: string;
  sopRef: string;
  selectionSummary: string;
};

export type Data = {
  id: number;
  rfpId: number;
  manualMethod: string;
  dataLogger: string;
  remoteReading: string;
  outstationDetails: string;
  storageDetails: string;
  ubReport: string;
  ubValue: string;
  dataManagementProcedure: string;
};

export type Maintenance = {
  id: number;
  maintenanceRef: boolean;
  preventativeScheduleRef: boolean;
};

export type Installation = {
  id: number;
  meterInstallDate: string;
  meterRemovalDate: string;
  hydraulicUpstream: string;
  hydraulicDownstream: string;
  environmental: string;
  onSiteTesting: string;
  safetyRisks: string;
  securityOfLocation: string;
};

export type Inventory = {
  id: number;
  make: string;
  type: string;
  model: string;
  serial: string;
  fmSize: string;
  pipelineSize: string;
  velocityRange: string;
  accuracyReading: string;
  accuracyFullScale: string;
  readingMethod: string;
};

export type FlowRegister = {
  id: number;
  rfpId: number;
  inventoryId: number;
  installationId: number;
  maintenanceId: number;
  inventory: Inventory;
  installation: Installation;
  maintenance: Maintenance;
};

export type FlowMeasurement = {
  id: number;
  rfpId: number;
  cumulativeFlow: boolean;
  fifteenMinFlow: boolean;
  eventRecording: boolean;
};

export type Location = {
  id: number;
  rfpId: number;
  region: string;
  stpcc: string;
  description: string;
  coordinateN: number;
  coordinateE: number;
  siteDrawingRef: string;
  flowDiagramRef: string;
};

export type GeneralInfo = {
  id: number;
  rfpId: number;
  licensee: string;
  address: string;
  contactNumber: string;
  reportDate: string;
  reportRef: string;
  responsiblePosition: string;
  responsibleDepartment: string;
  fmIdScada: string;
  fmIdSwsAssetNo: string;
  siteManagerName: string;
  faxNumber: string;
};



export type LocationType = {
  id: number;
  rfpId: number;
  type: string;

};
export type RFP = {
  id: number;
  typeOfRfp: string;
  RfpReference: string;
  startDate: string;
  completionDate: string;
  LocationType: LocationType;
  generalInfo: GeneralInfo;
  location: Location;
  approvalDetails: ApprovalDetails;
  flowMeasurement: FlowMeasurement;
  flowRegister: FlowRegister;
  data: Data;
  maf: MAF;
  attachments: Attachment[];
};

export type RfpType = {
  label: string;
  options: {
    value: string;
    label: string;
    icon?: string;
  }[];
};

export interface Option {
  value: string;
  label: string;
  icon: string;
}



export type User = {
  id: string;
  username:string;
  name: string;
  email: string;
  status: string;
  loginAttempts: string;
  createdAt: string;
  updatedAt: string;
  group: {
      id: number,
      name: string
  }
};

export interface TablePermission {
  id: number;
  userId: number | null;
  groupId: number;
  tableName: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface Group {
  id: number;
  name: string;
  tablePermissions: TablePermission[];
}



export type PermissionPayload = {
  userId: string;
  tableName: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
};

export interface Report {
  id: number;
  name: string;
  createdAt: string;
}