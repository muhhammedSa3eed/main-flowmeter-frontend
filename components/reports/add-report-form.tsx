'use client';

import { useState } from 'react';
import FlowMeterSearch from './flowmeter-search';
import StepsReportForm from './steps-report-form';

const AddReportForm = () => {
  const [showStepsForm, setShowStepsForm] = useState(false);
  // console.log({ showStepsForm });
  return (
    <div>
      {!showStepsForm && (
        <FlowMeterSearch setShowStepsForm={setShowStepsForm} />
      )}
      {showStepsForm && <StepsReportForm />}
    </div>
  );
};

export default AddReportForm;
