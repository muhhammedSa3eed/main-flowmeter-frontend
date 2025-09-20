import React from 'react'
import "../../app/styles/report.css";

export default function Page6() {
  return (
    <ol className="pl-2 m-2">
    <li className="">
      <h1 className="text-blue-500 text-2xl font-bold">
        4.1.3 Pipe Configuration / Hydraulic Effects
      </h1>
      <p>
        The flowmeter manufacturer defines the inlet and outlet to and
        from the flowmeter as requiring a minimum of 10 pipeline diameter
        (10D) and 5 pipeline diameters (5D) of straight lengths as
        respectively for the ideal reference condition.
        <br /> There are sufficient straight lengths to assume laminar
        flow and ideal conditions. However, as there are no installed
        details available to justify the location of the two sensors
        together with the absence of the flow system configuration details
        in relation to the pipe material and thickness, all of which are
        required to ensure the accuracy of the system and reduce the
        uncertainty.
        <br /> The lack of documentation, flow profile data or
        installation drawings to substantiate the initial accuracy at time
        of installation requires a technical assumption to be made which
        has assumed an uncertainty percentage of 1%.
      </p>
      <strong>
        The uncertainty figure for pipe installation configuration has
        accordingly been allocated 1% for the calculations.
      </strong>
    </li>

    <li className="">
      <h1 className="text-blue-500 text-2xl font-bold">
        4.1.4 Unsteady Flow
      </h1>
      <p>
        Continuous flowmeter readings were not available to be able to
        evaluate the flow conditions.
        <br /> Accordingly, it was not possible to observe the
        instantaneous flow readings and technical assessment has been
        taken which assumed an uncertainty of 0.5% for unsteady flow.
      </p>
      <strong>
        The uncertainty figure for unsteady flow has accordingly been
        allocated 0.5% for the calculations.
      </strong>
    </li>

    <li className="">
      <h1 className="text-blue-500 text-2xl font-bold">
        4.1.5 Environmental Factors
      </h1>
      <p>
        The technical specification of the flowmeter states as a range of
        ambient limits of the flow meter to be between -20°C to +50°C.{" "}
        <br />
        The flow meter was operating within the tolerable limits stated by
        the manufacturer. It was not possible to assess the temperature of
        the liquid flow through the flow meter, but it can be assumed that
        this would be no greater than the ambient temperature. <br />
        The manufacturer’s Technical product data only stipulates an
        uncertainty of ±0.5K. across the temperature range.
        <br /> A maximum sewage temperature of 35°C has been assumed for
        calculation purposes.
        <br /> Accordingly, based on a maximum operating temperature for
        the sensors of 35°C a relative uncertainty figure of 0.0026% has
        been allocated for calculation purposes. The calculation is
        provided in Appendix C.
        <br /> Accordingly, as a result of data provided calculation a
        0.0026% uncertainty will be used for the environmental factors.
      </p>
      <strong>
        The uncertainty figure for environmental factors has accordingly
        been allocated 0.0026%.
      </strong>
      <br />
    </li>
    <li className="">
      <h1 className="text-orange-500 text-2xl font-bold">
        4.2 SECONDARY METERING DEVICE
      </h1>
      <p>
        The secondary metering device effect on the uncertainty budget
        calculations are based on various inputs from the manufacturer’s
        specifications. These inputs are Drift, Hysteresis Drift, Null
        Drift, Repeatability and Resolution.
      </p>

      <br />
    </li>
  </ol>
  )
}
