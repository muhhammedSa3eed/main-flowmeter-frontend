import React from "react";
import "../../app/styles/report.css";

export default function Page10() {
  return (
    <ol className="pl-2 m-2">
      <li className="">
        <div className="calibration-list ml-3">
          <div className="row">
            <span className="label">Model/ Order Code </span>
            <span className="value">: D-75031 Eppingen</span>
          </div>
          <div className="row">
            <span className="label">Serial Number</span>
            <span className="value">: 1215PRC2464</span>
          </div>
          <div className="row">
            <span className="label">Flow Meter Size</span>
            <span className="value">: DN1300</span>
          </div>
          <div className="row">
            <span className="label">Pipeline Material</span>
            <span className="value">: AC</span>
          </div>
          <div className="row">
            <span className="label">Pipeline Size </span>
            <span className="value">: DN1300</span>
          </div>
        </div>
        <h3 className="text-orange-400 text-lg font-bold my-3 ml-3 ">
          5.2 SCADA RECORDS
        </h3>
        <p className="ml-3 text-justify">
          The site SCADA, data should supply the 24-hour instantaneous flow from
          its history log. The logged data is to be used to calculate the
          15-minute average flow and the calculation should be provided in
          Appendix C. Note 1: The uncertainty of average flow is derived from
          the weighted error from the results of the test points for the
          attributed flows given in Section 4.3.1. Note 2: The uncertainty of
          each 15-minute volume measurement (Unit) is derived thus:
          <strong className=" my-2 text-2xl text-center inline-block w-full">
            Q = Σ ( qm × 15 × 60 ) / 1000
          </strong>
          (i) Q = total daily volume (m3) (ii) qn = the 15-minute average flow
          reading (l/s) (iii) n = value number (normally 1 to 96 for 15-minute
          readings)
          <strong>
            Total daily cumulative flow as recorded on site is to be used for
            the calculation to determine the cumulative flow error.
          </strong>
        </p>
        <h1 className="text-blue-500 text-2xl font-bold my-3">
          6. Uncertainty Budget
        </h1>

        <p className="text-justify">
          The total daily volume reported to the DOE must not be more than ±10%
          of the actual flow values, at a 95% coverage probability. A flow vs
          uncertainty curve is required to be developed to calculate the
          uncertainty of the total daily volume. The expanded uncertainty is
          calculated for the measurement range of the flowmeter to develop the
          unique flow vs uncertainty curve for the Flow Measurement System. As
          required by the CoP and as stated in the Uncertainty Budget SOP-12
          flow rate test points which are data sets provided from the actual
          flow logged data are necessary to develop the flow vs uncertainty
          curve. The UB is based on 50% of the flow as a mid-range value and for
          a typical duration to allow a calculation of the Expanded Uncertainty
          to be provided using the data in the Manufacturer’s technical data and
          from the data provided during the survey and included in the Gap
          Analysis.
        </p>
        <strong>
          The Manufactures uncertainty figure has accordingly been allocated 2 %
          for the calculations.
        </strong>
        <p>
          As there is no calibration or configuration data provided a
          calibration test point assumption was also been required and has been
          assumed to be corresponding to the 50% flow value to provide an
          uncertainty figure as shown below:
        </p>
        <table className="Page10Table">
          <thead>
            <tr>
              <th>Test Point</th>
              <th>Flow (%)</th>
              <th>Flow (l/s)</th>
              <th>Duration (s)</th>
              <th>V target (I)</th>
              <th>V meas. (I)</th>
              <th>o.r. (%)</th>
              <th>Outp (mA)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td>50</td>
              <td>3000</td>
              <td>60</td>
              <td>1500</td>
              <td>1500</td>
              <td>0</td>
              <td>12.00</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-justify">
          The single data point as indicated above was used as a reference
          together with flowmeter technical data provided in Appendix A and used
          in the uncertainty calculations and as indicated in Appendix D.
        </p>
      </li>
    </ol>
  );
}
