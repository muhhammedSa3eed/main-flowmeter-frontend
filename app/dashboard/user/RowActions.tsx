// RowActions.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import EditUser from "@/components/CRUD/Users/EditUser";
import DeleteUser from "@/components/CRUD/Users/DeleteUser";
import { Sheet, SheetContent, SheetHeader,  } from "@/components/ui/sheet";

export function RowActions({ row }: { row: Row<User>  }) {
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const handleEditUserOpen = () => setIsEditUserOpen(true);
  const handleDeleteUserOpen = () => setIsDeleteUserOpen(true);
  // const handleCloseEditDialog = () => setIsEditUserOpen(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button size="icon" variant="ghost" className="shadow-none" aria-label="Edit item">
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleEditUserOpen} className="flex justify-between items-center">
              <span>Edit User</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteUserOpen} className="flex justify-between items-center">
              <span>Delete User</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Sheet */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
      <SheetContent side="right" className="md:max-w-md">
      <SheetHeader>
          </SheetHeader>
          <EditUser   users={row.original} />
        </SheetContent>
      </Sheet>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <AlertDialogContent>
          <DeleteUser  users={row.original} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}