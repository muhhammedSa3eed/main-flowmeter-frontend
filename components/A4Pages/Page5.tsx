import React from "react";
import "../../app/styles/report.css";

export default function Page5() {
  return (
    <ol className="pl-2 m-2 ">
      <li className="">
        <div className="calibration-list">
          <div className="row">
            <span className="label">Flow Meter Size</span>
            <span className="value">: DN1300</span>
          </div>
          <div className="row">
            <span className="label">Pipeline Material</span>
            <span className="value">: AC</span>
          </div>
          <div className="row">
            <span className="label">Pipeline Size</span>
            <span className="value">: DN1300</span>
          </div>
        </div>
        <p className="text-justify">
          Further details can be found in the Gap Analysis Report
          RFP009-ABU-MAFQ-WWTP-GAP. Attachments of the aforementioned report
          contains the available as-built drawings, site survey data, together
          with the single process flow diagram for this specific RFP
          installation and should be referred as part of this report.
        </p>
        <h1 className="text-blue-500 text-2xl font-bold">
          4. Sources of Flow Measurement Uncertainty
        </h1>
        <h3 className="text-orange-400 text-lg font-bold my-3 ml-3">
          4.1 PRIMARY METERING DEVICE FLOWMETER
        </h3>
        <h5 className="nested-topic text-sm font-bold mx-2 ml-5 mb-2">
          4.1.1 Manufacturer’s Uncertainty
        </h5>
        <p className="ml-5 text-justify">
          The OCM Pro CF flowmeter manufactures states it has a measurement
          uncertainty of ±0.5% of the reading in most applications including
          heavy polluted flows. There are also a selection of standard and high
          accuracy option when selecting the flow system. This installation is a
          wetted insertion type and has a velocity error limits per layer scan
          of less than 1% of the measured value when velocity is greater than
          1m/s. The measurement uncertainty and the error limits could
          potentially be ideal operating conditions which has been taken into
          consideration. As the application is TSE there will be particles in
          the flow which can deflect the ultrasonic signal and produces errors,
          therefore, a technical assumption has been made which assesses the
          uncertainty while operating at the velocity and flow maximum range as
          2.0%.
        </p>
        <strong className="ml-5 text-justify">
          The Manufactures uncertainty figure has accordingly been allocated 2 %
          for the calculations.
        </strong>
        <p className="ml-5 text-justify">
          As there is no calibration or configuration data provided a
          calibration test point assumption was also been required and has been
          assumed to be corresponding to the 50% flow value to provide an
          uncertainty figure as shown below:
        </p>
      </li>
      <table className="flowRateTable my-5 mx-auto">
        <thead>
          <tr>
            <th>flow Rate</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Q1</td>
            <td>2.00</td>
          </tr>
        </tbody>
      </table>
      <p className="ml-5 text-justify">
        This is based upon manufacturer’s data listed within the Product Manual,
        refer to Appendix A.
      </p>
      <p className="ml-5 text-justify">
        The manufacturer’s technical data specification with the relevant data
        highlighted is included in Appendix A.
      </p>
      <li className="">
        <h5 className="nested-topic ml-5 font-bold my-3">
          4.1.2 Installation Effects
        </h5>
        <p className="ml-5 text-justify">
          The visible pipeline installation did not appear to be damaged or
          suffering from any deformation of the pipe structure, there are no
          other obvious defects or abnormalities in the pipeline, or
          installation which would unduly affect the performance of the
          flowmeter. No other pipe configuration issues were observed which
          would have a measurable influence on the flow characteristics e.g. to
          introduce swirl effects. The technical assumption made in relation to
          the manufacturer’s accuracy statement, lack installation configuration
          data and pipeline flow profile has resulted in an uncertainty
          percentage factor of 1.5% being assumed.
        </p>
        <strong className="ml-5 text-justify">
          The uncertainty figure for installation effects has accordingly been
          allocated 1.5% for the calculations.
        </strong>
      </li>
    </ol>
  );
}
