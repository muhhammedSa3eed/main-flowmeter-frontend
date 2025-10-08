"use client";

import { Row } from "@tanstack/react-table";
import { Report } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Eye } from "lucide-react";

type RowActionsProps = {
  row: Row<Report>;
};

export default function RowActions({ row }: RowActionsProps) {
  const report = row.original;

  return (
    <div className="flex items-center gap-2 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Open actions"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`/dashboard/RfpReports/${report.id}`}
                className="flex items-center justify-between w-full"
              >
                <span>View</span>
                <Eye className="text-blue-500" />
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
