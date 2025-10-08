"use client";

import React from "react";
import Image from "next/image";
import "../../app/styles/report.css";

export default function Page1() {
  return (
    <div>
      <div className="cover-header flex items-center justify-between mb-8">
        <div className="brand-left">
          <Image
            src="/assets/logo.webp.png"
            alt="Authority Logo"
            width={100}
            height={100}
          />
        </div>
        <div className="brand-right text-base font-extrabold tracking-tight">
          PARSONS
        </div>
      </div>

      <div className="cover-hero h-[calc(100vh+45px)] pb-2">
        <div className="cover-photo p-2 mb-6 rounded-sm h-[600px]">
          <Image
            src="/assets/cover.png"
            alt="Mafraq WWTP Photo"
            width={600}
            height={800}
          />
        </div>

        <div className="cover-body flex gap-12 mt-6">
          <div className="cover-main flex-1 min-w-0">
            <div className="cover-title text-[15px] font-bold mb-3 leading-relaxed ">
              Contract O-13084 - Consultancy Services for Wastewater Flow
              Monitoring Code of Practice Compliance Plan in Abu Dhabi Emirate
            </div>
            <div className="cover-subtitle text-xs uppercase mb-2 opacity-95">
              UNCERTAINTY BUDGET REPORT
            </div>
            <div className="cover-meta text-[10px] opacity-95 leading-snug">
              MAFRAQ WwTP TSE OUTLET FROM FEC-2 TO IPS-1
              <br />
              RFP009-ABU-MAFQ-WWTP-UB, Issue 0<br />
              May 2019
            </div>
          </div>

          <aside className="cover-aside ml-auto w-[70mm] text-xs leading-relaxed text-left">
            <p className=" text-justify m-0 mb-2">
              Parsons International Limited
            </p>
            <p className=" text-justify m-0 mb-2">P.O. Box 5498 Abu Dhabi</p>
            <p className=" text-justify m-0 mb-2">United Arab Emirates</p>
            <p className=" text-justify m-0 mb-2">T: +971 2 6142416</p>
            <p className=" text-justify m-0 mb-2">F: +971 2 6218732</p>
            <p className=" text-justify m-0 mb-2">W: www.parsons.com</p>
          </aside>
        </div>

        <div className="cover-bottom flex items-center justify-end mt-12 gap-1.5 text-[10px] opacity-95">
          <span>delivering a better world</span>
          <div className="cover-squares flex gap-0.5 ml-1.5">
            <span className="c1 w-4 h-4 inline-block" />
            <span className="c2 w-4 h-4 inline-block" />
            <span className="c3 w-4 h-4 inline-block" />
            <span className="c4 w-4 h-4 inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
}
