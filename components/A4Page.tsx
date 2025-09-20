import React from "react";
import "../app/styles/report.css";
type A4PageProps = {
  page: number;
  total: number;
  reportId: number | string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function A4Page({
  page,
  total,
  title = `   ${page}`,
  children,
}: A4PageProps) {
  return (
    <article className="a4 page">
      <header className="a4-header">
      {title && <h2>{title}</h2>}
        <div className="toc-header">
            <h6 className="toc-left">
              Consultancy Services for Wastewater Flow Monitoring Code <br />
              of Practice Compliance Plan in Abu Dhabi Emirate
            </h6>
            <h6 className="toc-right">Uncertainty Budget Report</h6>
          </div>
      </header>

      <section className="a4-body">{children}</section>

      <footer className="a4-footer">
        {/* <span>Generated: {new Date().toLocaleString()}</span> */}
        <span>Page {page} / {total}</span>
      </footer>
    </article>
  );
}
