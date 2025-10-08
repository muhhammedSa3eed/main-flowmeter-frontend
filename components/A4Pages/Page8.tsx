import React from "react";
import "../../app/styles/report.css";

export default function Page8() {
  return (
    <ol className="pl-2 m-2">
      <div className="ml-5">
        <p className="text-justify">
          As this model of flow meter has a seven line with upto 21 character
          display and can be set to display a reading to three decimal places on
          the transmitter display. This value calculates into an absolute
          uncertainty of 0.06%.
        </p>
        <strong>
          The uncertainty figure for digital resolution has accordingly been
          allocated 0.06% for the calculations.
        </strong>
      </div>
      <li className="mt-2 ">
        <div className="ml-5">
          <h5 className="nested-topic font-bold">4.2.3 Signal Conversion</h5>
          <p className="text-justify">
            Repeatability is the ability of a measuring instrument to reproduce
            the same measured values under the same conditions. The manufacture
            has not stated any uncertainty in relation to repeatability. The
            lack of manufacture data requires a technical judgement to be made
            taking into account the age of the transmitter and the type
            transmitter, a technical uncertainty assessment made considered an
            uncertainty value of 0.5% being assumed.
          </p>
          <strong>
            The signal conversion uncertainty has accordingly been allocated
            0.5% for the calculations.
          </strong>
        </div>
        <h1 className="text-orange-500 text-xl my-3 ml-3 font-bold">
          4.3 DATA COLLECTION
        </h1>
      </li>

      <li className="mt-2 ml-5">
        <h5 className="nested-topic my-3  font-bold">4.3.1 Weighted Error</h5>
        <p className="text-justify">
          The weighted error accounts for errors due to the computation of the
          total daily flow based on the instantaneous flow data provided by
          SCADA for 15-minute intervals. This compared to the cumulative flow
          data at the flow meter location. The weighted error will compensate
          the difference in readings. However, from previous experience of
          similar installations a Weighted Error of 1.75% will be assumed and
          used in the Uncertainty Budget Calculation
        </p>
        <strong>
          The weighted error uncertainty value of 1.75% will be allocated for
          the calculations.
        </strong>
      </li>

      <li className="mt-2 ml-5">
        <h5 className="nested-topic my-3  font-bold">
          4.3.2 Data Signal Conversion
        </h5>
        <p className="text-justify">
          Resolution is also part of data signal conversion; however, it is a
          different resolution than the one for data conversion. This is the
          resolution of the signal sent from the transmitter to the site PLC and
          SCADA.
          <br />
          The signal transmitted from the transmitter a 4-20ma analogue and
          requires to be convert to a digital signal. The manufacturer’s
          technical specification for the transmitter, PLC analogue input
          modules and the SCADA system have all been considered and included in
          the calculation to determine the total uncertainty error which is used
          in the final calculation. The data signal conversion calculation is
          provided in Appendix C.
        </p>
        <strong>
          The data signal conversion value of 0.027% will be allocated for the
          calculations.
        </strong>
        <br />
      </li>
      <li className="ml-5">
        <h5 className="nested-topic my-3  font-bold">
          4.3.3 Estimates for Missing Data
        </h5>
        <p className="text-justify">
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
