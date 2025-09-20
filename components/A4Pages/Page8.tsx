import React from "react";
import "../../app/styles/report.css";

export default function Page8() {
  return (
    <ol className="pl-2 m-2">
      <p>
        As this model of flow meter has a seven line with upto 21 character
        display and can be set to display a reading to three decimal places on
        the transmitter display.
        <br /> This value calculates into an absolute uncertainty of 0.06%.
      </p>
      <strong>
        The uncertainty figure for digital resolution has accordingly been
        allocated 0.06% for the calculations.
      </strong>
      <li className="mt-2">
        <h1 className="text-blue-500 text-2xl font-bold">
          4.2.3 Signal Conversion
        </h1>
        <p>
          Repeatability is the ability of a measuring instrument to reproduce
          the same measured values under the same conditions.
          <br /> The manufacture has not stated any uncertainty in relation to
          repeatability.
          <br /> The lack of manufacture data requires a technical judgement to
          be made taking into account the age of the transmitter and the type
          transmitter, a technical uncertainty assessment made considered an
          uncertainty value of 0.5% being assumed.
        </p>
        <strong>
          The signal conversion uncertainty has accordingly been allocated 0.5%
          for the calculations.
        </strong>
        <h1 className="text-orange-500 text-xl font-bold">
          4.3 DATA COLLECTION
        </h1>
      </li>

      <li className="mt-2">
        <h1 className="text-blue-500 text-2xl font-bold">
          4.3.1 Weighted Error
        </h1>
        <p>
          The weighted error accounts for errors due to the computation of the
          total daily flow based on the instantaneous flow data provided by
          SCADA for 15-minute intervals. This compared to the cumulative flow
          data at the flow meter location. The weighted error will compensate
          the difference in readings.
          <br /> However, from previous experience of similar installations a
          Weighted Error of 1.75% will be assumed and used in the Uncertainty
          Budget Calculation
        </p>
        <strong>
          The weighted error uncertainty value of 1.75% will be allocated for
          the calculations.
        </strong>
      </li>

      <li className="mt-2">
        <h1 className="text-blue-500 text-2xl font-bold">
          4.3.2 Data Signal Conversion
        </h1>
        <p>
          Resolution is also part of data signal conversion; however, it is a
          different resolution than the one for data conversion. This is the
          resolution of the signal sent from the transmitter to the site PLC and
          SCADA.
          <br />
          The signal transmitted from the transmitter a 4-20ma analogue and
          requires to be convert to a digital signal.
          <br /> The manufacturer’s technical specification for the transmitter,
          PLC analogue input modules and the SCADA system have all been
          considered and included in the calculation to determine the total
          uncertainty error which is used in the final calculation.
          <br /> The data signal conversion calculation is provided in Appendix
          C.
        </p>
        <strong>
          The data signal conversion value of 0.027% will be allocated for the
          calculations.
        </strong>
        <br />
      </li>
      <li className="">
        <h1 className="text-blue-500 text-2xl font-bold">
          4.3.3 Estimates for Missing Data
        </h1>
        <p>
          Measurement errors can be introduced due to the limitations of some
          electronic equipment used to collect and record the flow readings.
          Errors can also be introduced by the dropping of data bits during
          retransmission.
        </p>

        <br />
      </li>
    </ol>
  );
}
