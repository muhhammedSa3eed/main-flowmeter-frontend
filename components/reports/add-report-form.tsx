/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';

import StepsReportForm from './steps-report-form';
import { FlowMeterSearch } from './flowmeter-search';

interface FlowData {
  flowMeterData: any;
  token?: string;
}
const AddReportForm = ({ flowMeterData, token }: FlowData) => {
  const [showStepsForm, setShowStepsForm] = useState(false);
  const [rfpIdData, setRfpIdData] = useState<number | undefined>(undefined);

  // console.log({ showStepsForm });
  return (
    <div>
      {!showStepsForm && (
        <FlowMeterSearch
          setShowStepsForm={setShowStepsForm}
          data={flowMeterData}
          setRfpIdData={setRfpIdData}
        />
      )}
      {showStepsForm && <StepsReportForm token={token} rfpIdData={rfpIdData} />}
    </div>
  );
};

export default AddReportForm;
