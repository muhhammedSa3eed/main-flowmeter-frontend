import React from "react";
import "../../app/styles/report.css";

export default function Page4() {
  return (
    <ol className="p-2 m-2">
      <li className="">
        <h1 className="my-4 text-blue-500 text-2xl font-bold">
          1. Introduction
        </h1>
        <p className="text-justify">
          As part of the Wastewater Flow Monitoring Code of Practice, ADSSC is
          required to comply with the Code requirements and identify information
          and any data gaps. The Wastewater Flow Monitoring Code of Practice
          came into force in September 2013, and ADSSC, developed a Compliance
          Plan in December 2013. The Compliance Plan covered the entire Abu
          Dhabi Emirate and split into the three regions to mirror the current
          operational and functional ADSSC departments namely: Abu Dhabi
          Mainland and Islands, Al Ain, and Western Regions. The Compliance Plan
          was presented to RSB for discussion and review after which it was
          approved by RSB for implementation. The ADSSC Compliance Plan included
          an initial Pilot Study which was conducted between December 2014 and
          February 2015 covering 14 sites and their associated Regulated Flow
          Points (RFP). The reports and associated findings produced as part of
          the Pilot Study were presented and approved by the RSB. ADSSC
          consequentially prepared the necessary contractual documents to tender
          for the remaining estimated 208 RFPs associated with 40 sites to be
          surveyed and the Contract awarded on 17th October 2017 to conduct
          surveys of the sites and produce the necessary compliance reports. The
          scope of this report is to estimate the existing flowmeter uncertainty
          budget on the flow metering site at Mafraq Wastewater Treatment Plant
          (WwTP) TSE outlet DN1300 pipeline to IPS-1 to verify compliance and to
          identify any non-compliance with the Flow Monitoring Code. The site
          visit was conducted on 13th February 2019 at Mafraq WwTP which is
          situated adjacent to Abu Dhabi – Al Ain Road area at co-ordinates N =
          2685805.84, E = 256790.71.
        </p>
      </li>

      <li className="">
        <h1 className="my-4 text-blue-500 text-2xl font-bold">
          2. Regulatory Requirements
        </h1>
        <p className="text-justify">
          An uncertainty analysis is required to be undertaken for all RFP’s.
          However, there is no previous calibration certificate available for
          this existing RFP to undertake the necessary calculations as required
          by ADSSC Standard Operating Procedure 12 (SOP-12). Therefore, the
          assessment is based on the manufacturer’s product data. A full
          uncertainty budget (UB) analysis will be required to be conducted by
          ADSSC in the future as part of the final installed design, and to
          fully comply with the MAF, using the methodology described in the
          ADSSC Uncertainty Budget Standard Operating Procedure SOP-12. In order
          to produce a fully developed UB across the flowmeter’s operating range
          a calibration certificate will need to be obtained either from the
          original manufacturer or by performing a full calibration at a
          recognized calibration facility. A full UB could also be calculated in
          the future if the meter is replaced with a new unit. SOP-12 contains
          the lists of relevant abbreviations and definitions used in this
          report.
        </p>
      </li>

      <li className="">
        <h1 className="my-4 text-blue-500 text-2xl font-bold">
          3. Flow Metering Site Description
        </h1>
        <p className="text-justify">
          The regulated flow metering point is a closed conduit 1300mm diameter
          pipeline. The flow meter measures the outgoing treated effluent from
          Mafraq WwTP Final Effluent Chamber (FEC-2) to IPS 1.
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
          <div className="row">
            <span className="label">Model/ Order Code</span>
            <span className="value">: D-75031 Eppingen</span>
          </div>
          <div className="row">
            <span className="label">Serial Number</span>
            <span className="value">: 1215PRC2464</span>
          </div>
        </div>
      </li>
    </ol>
  );
}
