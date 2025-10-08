import React from "react";
import "../../app/styles/report.css";

export default function Page7() {
  return (
    <ol className="pl-2 m-2">
      <li className="">
        <div className="ml-3">
          <p className="text-justify leading-6">
            Drift is defined as the change in output over a specified time with
            fixed input and operation conditions. Hysteresis drift, which is
            defined as the time-based dependence of a system`s output on current
            and past inputs. The dependence arises because the history affects
            the value of an internal state. To predict its future outputs,
            either its internal state or its history must be known. If a given
            input alternately increases and decreases, a typical mark of
            hysteresis is that the output forms a loop. Resolution is a measure
            of the smallest increment of total flow that can be individually
            recognized, normally defined by a single pulse. Repeatability is the
            ability of a measuring instrument to reproduce the same values
            measured under the same conditions. All the aforementioned
            components have their own uncertainties that can affect the
            calculation of the uncertainty budget of the flow meter. The
            manufacturer’s technical specification in relation to the above
            parameters only provided information on the milliamp input and
            output signals have a resolution stated as 0.4% as 12 bit
            resolution. The manufacturer’s technical specification is available
            for reference in Appendix A.
          </p>
          <table className="Page7Table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Source</th>
                <th>Manufacturer’s Specifications</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Signal Conversion</td>
                <td>Resolution</td>
                <td>0.4%</td>
              </tr>
            </tbody>
          </table>
          <p className="text-justify">
            As the manufacture’s technical specification did not provide the
            necessary information a technical assessment has been made and
            assumed in the following sections.
          </p>
        </div>
      </li>

      <li className="ml-5 ">
        <h5 className="nested-topic my-3  font-bold">
          4.2.1 Electronic Instrumentation
        </h5>
        <p className="text-justify">
          Electronic measuring equipment can “drift” over time, therefore
          calibration and verification are so important. The manufacturer’s
          technical literature did not relate to the transmitter draft or the
          flow meter “inaccuracies due to long-term drift and temperature
          drift.” Each of the previous mentioned drifts has its own uncertainty;
          however, as there has been no previous documented calibration or
          verification details available, it is necessary to follow the
          manufacturer’s recommendations until calibration or verification
          figures are available for inclusion in the appropriate calculations.
          The lack of supportive documentation and data to conduct drift
          calculations and using technical knowledge of the type of
          installation, component age and type of housing in which the
          transmitter was installed equipment required a technical uncertainty
          assessment to be made and an uncertainty value of 0.75% being assumed.
        </p>
        <strong className="text-justify">
          The uncertainty figure for electronic instrumentation has accordingly
          been allocated 0.75% which will be used for the uncertainty
          calculations.
        </strong>
      </li>

      <li className="ml-5 ">
        <h5 className="nested-topic my-3 font-bold">
          4.2.2 Digital Resolution
        </h5>
        <p className="text-justify">
          Digital instrumentation provides a discrete value but due to rounding,
          the true value can be within a prescribed percentage of the resolution
          of the display
        </p>
      </li>
    </ol>
  );
}
