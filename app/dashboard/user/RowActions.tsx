// RowActions.tsx
"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import EditUser from "@/components/CRUD/Users/EditUser";
import DeleteUser from "@/components/CRUD/Users/DeleteUser";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

export function RowActions({ row }: { row: Row<User> }) {
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  // open sheet on sm+ screens
  const handleEditUserOpen = () => setIsEditUserOpen(true);
  // open drawer on small screens
  const handleEditUserDrawerOpen = () => setIsEditDrawerOpen(true);
  const handleDeleteUserOpen = () => setIsDeleteUserOpen(true);
  // const handleCloseEditDialog = () => setIsEditUserOpen(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit item"
            >
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {/* Edit: Sheet on sm+ screens */}
            <DropdownMenuItem
              onClick={handleEditUserOpen}
              className="hidden sm:flex justify-between items-center"
            >
              <span>Edit User</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>

            {/* Edit: Drawer on small screens */}
            <DropdownMenuItem
              onClick={handleEditUserDrawerOpen}
              className="sm:hidden flex justify-between items-center"
            >
              <span>Edit User</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete User</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Sheet (sm+) */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent side="right" className="md:max-w-md">
          <SheetHeader></SheetHeader>
          <EditUser users={row.original} />
        </SheetContent>
      </Sheet>

      {/* Edit User Drawer (small screens) */}
      <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <DrawerContent className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 pt-4">
            <div>
              <h3 className="text-lg font-semibold">Edit User</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="close"
                className="p-1 rounded hover:bg-muted/50"
                onClick={() => setIsEditDrawerOpen(false)}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <EditUser users={row.original} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <AlertDialogContent>
          <DeleteUser users={row.original} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
