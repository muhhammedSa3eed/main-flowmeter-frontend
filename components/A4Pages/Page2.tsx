import React from "react";
import "../../app/styles/report.css";

export default function Page2() {
  return (
    <div className="h-[calc(100vh+100px)] relative p-2">
      <div className="revision-title text-2xl font-bold text-center my-8">
        REVISION HISTORY
      </div>
      <table className="revision-table w-full">
        <thead>
          <tr>
            <th className="text-center">Issue No.</th>
            <th className="text-center">Date</th>
            <th className="text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">0</td>
            <td className="text-center">May 2019</td>
            <td className="text-left">First Issue</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <table className="signatures w-full mt-8">
        <thead>
          <tr>
            <th className="text-center">Prepared by</th>
            <th className="text-center">Reviewed by</th>
            <th className="text-center">Approved by</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">sig1</td>
            <td className="text-center">sig2</td>
            <td className="text-center">sig3</td>
          </tr>
        </tbody>
      </table>

      <div className="auth-box text-sm leading-6 p-4 my-20  w-full text-justify">
        This document has been prepared specifically for ADSSC and is the
        intellectual property of Parsons International Limited (PARSONS). The
        contents of the report must only be used for the purpose for which it
        was commissioned under license and shall not be reproduced or used in
        full or in part outside of this application without the authorization of
        PARSONS.
      </div>
      <div className=" mt-12 text-center absolute -bottom-4 left-0  w-full">
        <div className="text-xl font-semibold mb-4 s">Prepared by</div>
        <div className="h-20 border-t font-semibold border-gray-300 flex items-center justify-center">
          <span className="text-sm italic">Flow Meter Reporting System</span>
        </div>
      </div>
    </div>
  );
}
