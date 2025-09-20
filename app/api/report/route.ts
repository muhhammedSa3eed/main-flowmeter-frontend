import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rfpId = searchParams.get("rfpId");
    const reportId = searchParams.get("reportId");

    if (!rfpId || !reportId) {
      return NextResponse.json(
        { error: "Missing rfpId or reportId" },
        { status: 400 }
      );
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
      `http://localhost:3000/dashboard/RfpReports/${rfpId}/report/${reportId}`,
      { waitUntil: "networkidle0" }
    );

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=report-${rfpId}-${reportId}.pdf`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
