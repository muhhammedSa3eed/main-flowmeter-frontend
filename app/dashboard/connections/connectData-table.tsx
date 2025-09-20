/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useId, useRef } from "react";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  VisibilityState,
  getSortedRowModel,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  CirclePlus,
  Columns3Icon,
  Trash2,
} from "lucide-react";

import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DeviceDB, SelectPolling, SelectType } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: any;
  data: DeviceDB[];
  preferences:any
  selectType: SelectType[];
  selectPolling: SelectPolling[];
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
    // dateBetweenFilterFn: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<DeviceDB> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function ConnectDataTable<TData, TValue>({
  columns,
  preferences,
  data,
}: DataTableProps<TData, TValue>) {
  const tableName = "ConnectionsTable";
  const id = useId();
 
  const [open, setOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [dataTable, setDataTable] = useState(data);
  useEffect(() => {
    setDataTable(data);
  }, [data]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    preferences || {}
  );
  const [tempColumnVisibility, setTempColumnVisibility] = useState(
    preferences || {}
  );
  const handleDeleteRows = async () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices/delete-many`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ deviceIds: selectedIds }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        toast.error(error?.message || "Failed to delete devices.");
        return;
      }

      toast.success(" Devices deleted successfully!");
      setDataTable((prev) =>
        prev.filter((item) => !selectedIds.includes(item.id))
      );
      table.resetRowSelection();
    } catch (err) {
      toast.error(" Error deleting devices.");
      console.error(err);
    }
  };
  const table = useReactTable<DeviceDB>({
    data: dataTable,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
  });
  // console.log("table.getColumn('name')", table.getColumn('name'));
  // console.log(
  //   "table.getColumn('name')?.getFilterValue()",
  //   table.getColumn('name')?.getFilterValue()
  // );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className={cn("peer min-w-auto ps-9")}
          />
          {/* Toggle columns visibility */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="border-green-500">
                <Columns3Icon className="-ms-1 opacity-60" size={16} />
                View
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-96">
              <SheetHeader>
                <SheetTitle>All Columns</SheetTitle>
                <SheetDescription>
                  Choose to Hide or Show Colmuns
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[80vh] text-green-500 p-2 ">
                <Button
                  size="custom"
                  className={cn(
                    "mb-4 w-full mt-4 p-2",
                    Object.values(tempColumnVisibility).every(Boolean)
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : " border-green-500 hover:bg-gray-500"
                  )}
                  onClick={() => {
                    const allVisible =
                      Object.values(tempColumnVisibility).every(Boolean);
                    const newVisibility = table
                      .getAllColumns()
                      .reduce((acc, column) => {
                        if (column.getCanHide()) {
                          acc[column.id] = !allVisible;
                        }
                        return acc;
                      }, {} as VisibilityState);
                    setTempColumnVisibility(newVisibility);
                  }}
                >
                  {Object.values(tempColumnVisibility).every(Boolean)
                    ? "Deselect All Columns"
                    : "Select All Columns"}
                </Button>
                <div className="space-y-3 m-2">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      const header =
                        typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.id;

                      return (
                        <div
                          key={column.id}
                          className="has-[data-state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border border-green-500 p-4 shadow-xs outline-none"
                        >
                          <Checkbox
                            id={column.id}
                            checked={tempColumnVisibility[column.id] ?? true}
                            onCheckedChange={(value) =>
                              setTempColumnVisibility((prev: VisibilityState) => ({
                                ...prev,
                                [column.id]: !!value,
                              }))
                            }
                            className="order-1 after:absolute after:inset-0"
                            aria-describedby={`${column.id}-description`}
                          />
                          <div className="grid grow gap-2">
                            <label
                              htmlFor={column.id}
                              className="capitalize font-medium text-sm"
                            >
                              {header}
                            </label>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
              <Button
                onClick={async () => {
                  setColumnVisibility(tempColumnVisibility);
                  setOpen(false);

                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/preferences`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                          tableName,
                          preferences: tempColumnVisibility,
                        }),
                      }
                    );

                    if (!res.ok) {
                      toast.error(" Failed to save preferences");
                      return;
                    }

                    toast.success(" Preferences saved!");
                  } catch (error) {
                    toast.error(" Network error");
                    console.error(error);
                  }
                }}
                className="mt-4 w-full"
              >
                Save
              </Button>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto border-green-500" variant="outline">
                  <Trash2
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="bg-background text-black-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="flex items-center gap-3">
            <Link href="/dashboard/connections/addConnections">
              <Button className="ml-auto" variant={"custom"}>
                <CirclePlus
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Add New Connections
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
      <Table >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`whitespace-nowrap font-semibold text-black dark:text-white ${
                        header.id === "actions" ? "sticky -right-[1px]" : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`whitespace-nowrap ${
                        cell.column.id === "actions"
                          ? "sticky -right-[1px] text-center bg-background z-10"
                          : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
