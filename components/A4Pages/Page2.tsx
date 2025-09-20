import React from 'react'
import "../../app/styles/report.css";

export default function Page2() {
  return (
    <div>
          <div className="revision-title">REVISION HISTORY</div>
          <table className="revision-table">
            <thead>
              <tr>
                <th>Issue No.</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td>May 2019</td>
                <td style={{ textAlign: "left" }}>First Issue</td>
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

          <table className="signatures">
            <thead>
              <tr>
                <th>Prepared by</th>
                <th>Reviewed by</th>
                <th>Approved by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sig1</td>
                <td>sig2</td>
                <td>sig3</td>
              </tr>
            </tbody>
          </table>

          <div className="auth-box">
            This document has been prepared specifically for ADSSC and is the
            intellectual property of Parsons International Limited (PARSONS).
            The contents of the report must only be used for the purpose for
            which it was commissioned under license and shall not be reproduced
            or used in full or in part outside of this application without the
            authorization of PARSONS.
          </div>
        </div>
  )
}
