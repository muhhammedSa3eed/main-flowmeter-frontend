"use client";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisIcon, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { RFP } from "@/types";
import DeleteRFP from "@/components/CRUD/RFP/DeleteRFP";
import Link from "next/link";

type RowActionsProps = {
  row: Row<RFP>;
};

export default function RowActions({ row }: RowActionsProps) {
  const [isDeleteDeviceOpen, setIsDeleteDeviceOpen] = useState(false);



  const handleDeleteUserOpen = () => setIsDeleteDeviceOpen(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              title="More options"
              className="focus:ring-0"
              aria-label="Open options menu"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/EditRFP/${row.original.id}`}
                className="flex justify-between items-center w-full"
              >
                <span>Edit Flow-meter</span>
                <Pencil className="text-blue-500" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/RfpReports/${row.original.id}`}
                className="flex justify-between items-center w-full"
              >
                <span>View Reports</span>
                <Eye className="text-gray-500" />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Flow-meter</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      
      <AlertDialog
        open={isDeleteDeviceOpen}
        onOpenChange={setIsDeleteDeviceOpen}
      >
        <AlertDialogContent>
          <DeleteRFP RFP={row.original.RfpReference} RFPId={row.original.id} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
