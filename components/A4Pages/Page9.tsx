import React from "react";
import "../../app/styles/report.css";

export default function Page9() {
  return (
    <ol className="pl-2 m-2">
      <p>
        Quantization and retransmission errors are generally unavoidable but
        would not generally exceed 1.0% uncertainty for this type of
        installation.
        <br /> There does not appear to be any sections of missing data in the
        instantaneous flow data received from site. Even though no missing data
        had been observed during the period recorded, there can be occasions
        when there can be technical issues which are unavoidable. Hence a
        technical assessment has been made which would place an uncertainty of
        1.0% in relation to missing data.
      </p>
      <strong>
        The estimates for missing data have been assessed as 1.0% which will be
        used for uncertainty calculations
      </strong>
      <h1 className="text-orange-500 text-xl font-bold">
        4.4 IN SITU FLOW COMPARISONS
      </h1>
      <li className="mt-2">
        <h1 className="text-blue-500 text-2xl font-bold">
          4.4.1 Combined Uncertainty Flow Reference Standard
        </h1>
        <p>
          The section to be completed by certified competent person and the
          statements below are required to be verified and updated as
          appropriate for the specific installation.
          <br /> Dry verifications of flow meters should occur at least
          annually, and the verification certificate data compiled, and analysis
          of the annual data conducted, to determine the drift and uncertainty
          changes in the readings which can be extrapolated to determine if
          there are linear or proportional patterns which would provide
          sufficient information to allow technical predictable records and
          provide an indication of how accurate the flow meter is at that time.
          <br /> The absences of available sufficient historical data have
          required a technical assessment was made as to the most appropriate
          uncertainty value to be used taking cognition of comparable
          installations.
          <br />
          The technical assessment places an uncertainty of 0.0% as a result of
          limited information available to conduct suitable calculation.
        </p>
        <strong>
          The combined uncertainty flow reference standard has been assessed as
          0.0% which will be used for uncertainty calculations.
        </strong>
      </li>

      <li className="mt-2">
        <h1 className="text-blue-500 text-2xl font-bold">
          5. Data Collected for Budget Calculation
        </h1>
        <p className="mb-2">
          The following data will be required to be collected from the site,
          manufacturer and the SCADA system and then used in the uncertainty
          budget calculations:
        </p>

        <ol style={{ listStyleType: "disc", paddingLeft: "20px" }}>
          <li>Flowmeter manufacturer’s Information.</li>
          <li>1 day daily 24-hour cumulative flow soft copy as prepared.</li>
          <li>Manufacturers Flowmeter Calibration Sheet</li>
          <li>
            SCADA records showing 15-minute average flows over a 24-hour period
            for 3 consecutive days.
          </li>
        </ol>
      </li>

      <li className="mt-2">
        <h1 className="text-orange-500 text-2xl font-bold">
          5.1 ORIGINAL CALIBRATION CERTIFICATE
        </h1>
        <p className="mb-4">
          The original calibration details or a certificate were not available
          and technical assumptions were used in conjunction with data provided
          in the manufacture’s technical manual for the below flowmeter.
        </p>

        <div className="calibration-list">
          <div className="row">
            <span className="label">Flow Meter Unit Reference</span>
            <span className="value">: T-ADM-MFIA-STP-PH2-EPUM-I-TRON-0007</span>
          </div>
          <div className="row">
            <span className="label">Field Tag No.</span>
            <span className="value">: IPS-1</span>
          </div>
          <div className="row">
            <span className="label">Flow Meter Manufacturer</span>
            <span className="value">: NIVUS</span>
          </div>
          <div className="row">
            <span className="label">Flow Meter Type</span>
            <span className="value">: Ultrasonic</span>
          </div>
        </div>
        <br/>
      </li>
    </ol>
  );
}
