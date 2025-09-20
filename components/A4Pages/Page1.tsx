import React from 'react'
import Image from "next/image";
import "../../app/styles/report.css";
export default function Page1() {
  return (
    <div>
    <div className="cover-header">
            <div className="brand-left">
              <Image
                src="/assets/logo.webp.png"
                alt="Authority Logo"
                width={100}
                height={100}
              />
            </div>
            <div className="brand-right">PARSONS</div>
          </div>

          <div className="cover-hero">
            <div className="cover-photo">
              <Image
                src="/assets/cover.png"
                alt="Mafraq WWTP Photo"
                width={600}
                height={400}
              />
            </div>

            <div className="cover-body">
              <div className="cover-main">
                <div className="cover-title">
                  Contract O-13084 - Consultancy Services for Wastewater Flow
                  Monitoring Code of Practice Compliance Plan in Abu Dhabi
                  Emirate
                </div>
                <div className="cover-subtitle">UNCERTAINTY BUDGET REPORT</div>
                <div className="cover-meta">
                  MAFRAQ WwTP TSE OUTLET FROM FEC-2 TO IPS-1
                  <br />
                  RFP009-ABU-MAFQ-WWTP-UB, Issue 0<br />
                  May 2019
                </div>
              </div>

              <aside className="cover-aside">
                <p>Parsons International Limited</p>
                <p>P.O. Box 5498 Abu Dhabi</p>
                <p>United Arab Emirates</p>
                <p>T: +971 2 6142416</p>
                <p>F: +971 2 6218732</p>
                <p>W: www.parsons.com</p>
              </aside>
            </div>

            <div className="cover-bottom">
              <span>delivering a better world</span>
              <div className="cover-squares">
                <span className="c1" />
                <span className="c2" />
                <span className="c3" />
                <span className="c4" />
              </div>
            </div>
          </div>
          </div>
  )
}
