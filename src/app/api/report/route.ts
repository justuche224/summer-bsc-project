import { NextResponse } from "next/server";
import { getReportData } from "@/app/actions/report";
import { generateFinancialReport } from "@/lib/pdf-generator";

export async function GET() {
  try {
    const reportData = await getReportData();

    if (!reportData) {
      return NextResponse.json(
        { error: "No data available for report" },
        { status: 400 }
      );
    }

    const doc = generateFinancialReport(reportData);
    const pdfBuffer = doc.output("arraybuffer");

    if (!pdfBuffer || pdfBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: "Failed to generate PDF" },
        { status: 500 }
      );
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
    const fileName = `financial-report-${dateStr}-${timeStr}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
