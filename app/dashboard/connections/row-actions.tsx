"use client";
import DeleteConnections from "@/components/CRUD/Connections/DeleteConnections";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeviceDB } from "@/types";
import { Row } from "@tanstack/react-table";


import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type RowActionsProps = {
  row: Row<DeviceDB>;
};

export const RowActions = ({ row }: RowActionsProps) => {
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
                href={`/dashboard/connections/editConnections/${row.original.id}`}
                className="flex justify-between items-center w-full"
              >
                 <span>Edit Device</span>
                <Pencil className="text-blue-500" />
              </Link>
             
              
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Device</span>
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
          <DeleteConnections
            device={row.original.name}
            deviceId={row.original.id}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};


