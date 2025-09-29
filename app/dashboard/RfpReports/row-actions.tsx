"use client";

import { Row } from "@tanstack/react-table";
import { Report } from "./columns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type RowActionsProps = {
  row: Row<Report>;
};

export default function RowActions({ row }: RowActionsProps) {
  const report = row.original;

  return (
    <div className="flex items-center gap-2">
      <Link href={`/RfpReports/${report.reportId}`}>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          Details
        </Button>
      </Link>
    </div>
  );
}
