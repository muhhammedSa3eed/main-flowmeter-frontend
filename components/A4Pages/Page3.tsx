import React from "react";

export default function Page3() {
  const toc = [
    { title: "INTRODUCTION", page: 4 },
    { title: "REGULATORY REQUIREMENTS", page: 4 },
    { title: "FLOW METERING SITE DESCRIPTION", page: 4 },
    {
      title: "SOURCES OF FLOW MEASUREMENT UNCERTAINTY",
      page: 5,
      children: [
        { title: "4.1 PRIMARY METERING DEVICE FLOWMETER", page: 5 },
        { title: "4.2 SECONDARY METERING DEVICE", page: 6 },
        { title: "4.3 DATA COLLECTION", page: 8 },
        { title: "4.4 IN SITU FLOW COMPARISONS", page: 9 },
      ],
    },
    {
      title: "DATA COLLECTED FOR BUDGET CALCULATION",
      page: 9,
      children: [
        { title: "5.1 ORIGINAL CALIBRATION CERTIFICATE", page: 9 },
        { title: "5.2 SCADA RECORDS", page: 10 },
      ],
    },
    { title: "UNCERTAINTY BUDGET", page: 10 },
    { title: "CONCLUSIONS", page: 11 },
  ];

  const appendices = [
    "Appendix A – Product Manual",
    "Appendix B – Manufacturer’s Original Calibration Certificate",
    "Appendix C – Data Signal Conversion Calculation",
    "Appendix D – Expanded Uncertainty",
  ];

  return (
    <div className=" h-[calc(100vh+100px)] p-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        TABLE OF CONTENTS
      </h2>

      <ol className="space-y-6">
        {toc.map((item, i) => (
          <li key={i}>
            <div className="flex justify-between items-center border-b border-dotted font-bold border-gray-400 pb-1">
              <span className="pr-4">{item.title}</span>
              <span className="font-bold text-blue-900">{item.page}</span>
            </div>
            {item.children && (
              <ol className="ml-6 mt-3 space-y-4">
                {item.children.map((sub, j) => (
                  <li key={j}>
                    <div className="flex justify-between items-center border-b border-dotted font-semibold border-gray-300 pb-1">
                      <span className="pr-4">{sub.title}</span>
                      <span className="font-bold text-blue-900">
                        {sub.page}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>

      <h3 className="mt-10 text-xl font-semibold text-blue-900">APPENDICES</h3>
      <ul className="list-disc ml-6 mt-2 space-y-1 font-bold">
        {appendices.map((app, k) => (
          <li key={k}>{app}</li>
        ))}
      </ul>
    </div>
  );
}
