// RowActions.tsx
'use client';

import { useState } from 'react';
import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisIcon, Pencil, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import DeleteGroup from '@/components/CRUD/Groups/DeleteGroup';
import EditGroup from '@/components/CRUD/Groups/EditGroup';
import { Role } from '@/types';

export function RowActions({ row }: { row: Row<Role> }) {
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
            <DropdownMenuItem
              onClick={handleEditUserOpen}
              className="flex justify-between items-center"
            >
              <span>Edit Group</span>
              <Pencil className="text-blue-500" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteUserOpen}
              className="flex justify-between items-center"
            >
              <span>Delete Group</span>
              <Trash2 className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit User Sheet */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent side="right" className="2xl:max-w-2xl">
          <SheetHeader></SheetHeader>
          <EditGroup roles={row.original} />
        </SheetContent>
      </Sheet>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <AlertDialogContent>
          <DeleteGroup roles={row.original} />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
