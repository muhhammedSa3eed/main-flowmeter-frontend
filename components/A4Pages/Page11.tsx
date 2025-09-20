import React from "react";
import "../../app/styles/report.css";

export default function Page11() {
  return (
    <ol className="pl-2 m-2">
      <li className="">
        <h1 className="text-blue-500 text-2xl font-bold">7. Conclusions</h1>

        <p>
          Discussion with regards to the data and figures used for the
          calculations of relative uncertainties in the table in Section 6 above
          can be found in Section 4, with the calculations available in Appendix
          D.
          <br />
          The Overall Combined Standard Uncertainty and Expanded Uncertainty at
          95% Coverage Probability is presented in the table below:
        </p>
        <table className="Page10Table">
          <thead>
            <tr>
              <th>Flow Rate</th>
              <th>Combined Standard Uncertainty +%</th>
              <th>Expanded Uncertainty +%</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Q1</td>
              <td>1.881</td>
              <td>3.687</td>
            </tr>
          </tbody>
        </table>

        <p>
          The calculations for the combined uncertainty are provided in Appendix
          D.
          <br /> The worst case Expanded Uncertainty value of ±3.687% will be
          used to determine compliance.
          <br /> The Expanded Uncertainty value of ±3.687% is compliant as the
          value is within the allowable ±10% of actual values at 95% coverage
          probability, as stipulated by the RSB Wastewater Flow Monitoring Code
          of Practice.
        </p>
        {/* <br/> */}
      </li>
    </ol>
  );
}
