"use client";
import React from "react";
import { A4Page } from "./A4Page";
import "../app/styles/report.css";
import Page1 from "./A4Pages/Page1";
import Page2 from "./A4Pages/Page2";
import Page3 from "./A4Pages/Page3";
import Page4 from "./A4Pages/Page4";
import Page5 from "./A4Pages/Page5";
import Page6 from "./A4Pages/Page6";
import Page7 from "./A4Pages/Page7";
import Page8 from "./A4Pages/Page8";
import Page9 from "./A4Pages/Page9";
import Page10 from "./A4Pages/Page10";
import Page11 from "./A4Pages/Page11";
import Page12 from "./A4Pages/Page12";
import Page13 from "./A4Pages/Page13";
import Page14 from "./A4Pages/Page14";
import Page15 from "./A4Pages/Page15";
import { useParams } from "next/navigation";
type ReportsProps = { ReportId: number };

export default function Reports({ ReportId }: ReportsProps) {
  const pages = [
    {
      title: "Contract Overview",
      content: <Page1 />,
    },
    {
      title: "Findings & Narrative",
      content: <Page2 />,
    },
    {
      title: "Table of Contents",
      content: <Page3 />,
    },
    {
      title: "",
      content: <Page4 />,
    },

    {
      title: "",
      content: <Page5 />,
    },
    {
      title: "",
      content: <Page6 />,
    },
    {
      title: "",
      content: <Page7 />,
    },
    {
      title: "",
      content: <Page8 />,
    },
    {
      title: "",
      content: <Page9 />,
    },
    {
      title: "",
      content: <Page10 />,
    },
    {
      title: "",
      content: <Page11 />,
    },
    {
      title: "",
      content: <Page12 />,
    },
    {
      title: "",
      content: <Page13 />,
    },
    {
      title: "",
      content: <Page14 />,
    },
    {
      title: "",
      content: <Page15 />,
    },
  ];
  const params = useParams<{ RfpId: string; ReportId: string }>();

  const handleDownload = () => {
    window.location.href = `/api/report?rfpId=${params.RfpId}&reportId=${params.ReportId}`;
  };
  return (
    <div className="a4-wrapper">
      <div className="toolbar">
        <span>Report ID: {ReportId}</span>

        <button
          className="btn-print hidden lg:block"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>

        <button className="btn-print block lg:hidden" onClick={handleDownload}>
          Download PDF
        </button>
      </div>

      <div className="pages">
        {pages.map((pg, idx) => (
          <A4Page
            key={idx}
            page={idx + 1}
            total={pages.length}
            reportId={ReportId}
            title={pg.title}
          >
            {pg.content}
          </A4Page>
        ))}
      </div>
    </div>
  );
}
