/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useId, useRef, useLayoutEffect } from "react";
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
import { DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { GripVertical, X, Save } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  preferences: any;
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [sorting, setSorting] = useState<SortingState>(() => {
    try {
      if (preferences && (preferences as any).sorting) {
        return (preferences as any).sorting as SortingState;
      }
      const raw = localStorage.getItem(`${tableName}-sorting`);
      if (raw) return JSON.parse(raw) as SortingState;
    } catch (e) {
      // ignore
    }
    return [];
  });
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
  const [tempColumnOrder, setTempColumnOrder] = useState<string[]>(
    (preferences && (preferences.order as string[])) || []
  );
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor));

  // Load preferences from server (if any) and apply to temp state
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/get/preferences/${tableName}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch preferences");
        const json = await res.json();
        if (json.preferences) {
          const prefs = json.preferences;
          if (prefs.visibility) {
            setColumnVisibility(prefs.visibility);
            setTempColumnVisibility(prefs.visibility);
          } else {
            setColumnVisibility(prefs);
            setTempColumnVisibility(prefs);
          }
          if (prefs.order) {
            const filtered = (prefs.order as string[]).filter(
              (id) => id !== "select" && id !== "actions"
            );
            setTempColumnOrder(filtered);
          }
          if (prefs.sorting) setSorting(prefs.sorting as SortingState);
          setPrefsLoaded(true);
        }
      } catch (error) {
        console.error(" Error loading preferences:", error);
      }
    };
    fetchPreferences();
  }, [tableName]);
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

  // Persist sorting locally so reloads keep the current sort as a fallback
  useEffect(() => {
    try {
      localStorage.setItem(`${tableName}-sorting`, JSON.stringify(sorting));
    } catch (e) {
      // ignore
    }
  }, [sorting, tableName]);

  // waitForApply/applied logic to avoid flash of initial/default sorting
  const waitForApply = true;
  const [applied, setApplied] = useState<boolean>(!waitForApply);
  useLayoutEffect(() => {
    if (waitForApply) setApplied(true);
  }, [waitForApply]);

  // determine readiness to render (prefs loaded, saved sorting exists, or data array present)
  const readyToRender =
    prefsLoaded || (sorting && sorting.length > 0) || Array.isArray(dataTable);

  function SortableItem({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none",
    } as React.CSSProperties;

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }

  // initialize column order from table if not provided by preferences
  const allColumnCount = table.getAllColumns().length;

  useEffect(() => {
    try {
      const ids = table
        .getAllColumns()
        .map((c) => c.id)
        .filter((id) => id !== "select" && id !== "actions");
      if (!tempColumnOrder || tempColumnOrder.length === 0) {
        setTempColumnOrder(ids);
      } else {
        // ensure order contains all current columns (append any new ones)
        const missing = ids.filter((id) => !tempColumnOrder.includes(id));
        if (missing.length) setTempColumnOrder((prev) => [...prev, ...missing]);
      }
    } catch (e) {
      // table may not be ready yet
    }
  }, [allColumnCount, tempColumnOrder, table]);

  // When preferences are loaded initially, apply saved order to the table once
  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      const existing = table.getAllColumns().map((c) => c.id);
      let orderToApply = tempColumnOrder.filter((id) => existing.includes(id));
      if (existing.includes("select")) {
        orderToApply = [
          "select",
          ...orderToApply.filter((id) => id !== "select"),
        ];
      }
      if (orderToApply.length) table.setColumnOrder(orderToApply);
    } catch (e) {
      // ignore
    }
    // only run once after prefsLoaded flips to true
  }, [prefsLoaded, tempColumnOrder, table]);
  // console.log("table.getColumn('name')", table.getColumn('name'));
  // console.log(
  //   "table.getColumn('name')?.getFilterValue()",
  //   table.getColumn('name')?.getFilterValue()
  // );

  // If preferences haven't loaded and we don't yet have sorting/data, show a skeleton like PermissionsTable
  if (!readyToRender || !applied) {
    return (
      <div className="bg-background overflow-hidden rounded-md border p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-slate-100 rounded w-full mb-2" />
          <div className="h-4 bg-slate-100 rounded w-full mb-2" />
          <div className="h-4 bg-slate-100 rounded w-3/4" />
        </div>
      </div>
    );
  }

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
          {/* Toggle columns visibility: Sheet on sm+ screens, Drawer on xs */}
          <div className="hidden sm:block">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-green-500">
                  <Columns3Icon className="-ms-1 opacity-60" size={16} />
                  View
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-96">
                {/* accessible dialog title for screen readers */}
                <SheetTitle className="sr-only">All Columns</SheetTitle>
                <div className="flex items-center justify-between px-4 pt-4">
                  <div>
                    <h3 className="text-lg font-semibold">All Columns</h3>
                    <p className="text-sm text-muted-foreground">
                      Show, hide and reorder columns
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="close"
                      className="p-1 rounded hover:bg-muted/50"
                      onClick={() => setOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="px-4 mt-2 flex items-center gap-2">
                  <Button
                    size="custom"
                    className={cn(
                      "flex-1 p-2",
                      Object.values(tempColumnVisibility).every(Boolean)
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "border-green-500 hover:bg-gray-500"
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
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                  <Button
                    variant="outline"
                    size="custom"
                    className="px-2"
                    onClick={() => {
                      const ids = table
                        .getAllColumns()
                        .map((c) => c.id)
                        .filter((id) => id !== "select" && id !== "actions");
                      setTempColumnOrder(ids);
                      toast("✅ Order reset Successfully");
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <ScrollArea className="h-[70vh] text-foreground p-2 mt-3">
                  <div className="px-2 mb-2 text-sm text-muted-foreground">
                    Drag to reorder. Disabled checkboxes mean the column cannot
                    be hidden.
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => {
                      const { active, over } = e;
                      if (!over || active.id === over.id) return;
                      const oldIndex = tempColumnOrder.indexOf(
                        active.id as string
                      );
                      const newIndex = tempColumnOrder.indexOf(
                        over.id as string
                      );
                      if (oldIndex !== -1 && newIndex !== -1) {
                        setTempColumnOrder((prev) => {
                          const next = arrayMove(prev, oldIndex, newIndex);
                          return next;
                        });
                      }
                    }}
                  >
                    <SortableContext
                      items={tempColumnOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2 p-1">
                        {(() => {
                          const allIds = table
                            .getAllColumns()
                            .map((c) => c.id)
                            .filter(
                              (id) => id !== "select" && id !== "actions"
                            );
                          let order =
                            tempColumnOrder && tempColumnOrder.length
                              ? [...tempColumnOrder]
                              : [...allIds];
                          const missing = allIds.filter(
                            (id) => !order.includes(id)
                          );
                          if (missing.length) order = [...order, ...missing];
                          const finalOrder = order.filter(
                            (id) => id !== "select" && id !== "actions"
                          );
                          return finalOrder.map((colId) => {
                            const column = table
                              .getAllColumns()
                              .find((c) => c.id === colId);
                            if (!column) return null;
                            const canHide = column.getCanHide();
                            const header =
                              typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id;

                            return (
                              <SortableItem key={colId} id={colId}>
                                <div className="flex items-center gap-3 rounded-md p-3 bg-background/50 hover:bg-muted/50 border border-border">
                                  <div className="cursor-grab px-2 text-muted-foreground">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <Checkbox
                                    id={colId}
                                    checked={
                                      tempColumnVisibility[colId] ?? true
                                    }
                                    onCheckedChange={(value) => {
                                      if (!canHide) return;
                                      setTempColumnVisibility(
                                        (prev: VisibilityState) => ({
                                          ...prev,
                                          [colId]: !!value,
                                        })
                                      );
                                    }}
                                    disabled={!canHide}
                                    className="mr-2"
                                    aria-describedby={`${colId}-description`}
                                  />
                                  <div className="grow">
                                    <div className="font-medium capitalize">
                                      {header}
                                    </div>
                                  </div>
                                </div>
                              </SortableItem>
                            );
                          });
                        })()}
                      </div>
                    </SortableContext>
                  </DndContext>
                </ScrollArea>
                <Button
                  onClick={async () => {
                    setColumnVisibility(tempColumnVisibility);
                    setOpen(false);

                    try {
                      // ensure table reflects the latest order before saving
                      try {
                        const existing = table.getAllColumns().map((c) => c.id);
                        let orderToApply = tempColumnOrder.filter((id) =>
                          existing.includes(id)
                        );
                        if (existing.includes("select")) {
                          orderToApply = [
                            "select",
                            ...orderToApply.filter((id) => id !== "select"),
                          ];
                        }
                        if (orderToApply.length)
                          table.setColumnOrder(orderToApply);
                      } catch (e) {
                        // ignore
                      }

                      const payload = {
                        tableName,
                        preferences: {
                          visibility: tempColumnVisibility,
                          order: tempColumnOrder,
                          sorting,
                        },
                      };

                      const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/preferences`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                          body: JSON.stringify(payload),
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

          {/* Small screens: use Drawer with identical content */}
          <div className="sm:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="border-green-500">
                  <Columns3Icon className="-ms-1 opacity-60" size={16} />
                  View
                </Button>
              </DrawerTrigger>
              <DrawerContent className="flex flex-col h-full">
                {/* accessible dialog title for screen readers */}
                <DialogTitle className="sr-only">All Columns</DialogTitle>
                <div className="flex items-center justify-between px-4 pt-4">
                  <div>
                    <h3 className="text-lg font-semibold">All Columns</h3>
                    <p className="text-sm text-muted-foreground">
                      Show, hide and reorder columns
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="close"
                      className="p-1 rounded hover:bg-muted/50"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="px-4 mt-2 flex items-center gap-2">
                  <Button
                    size="custom"
                    className={cn(
                      "flex-1 p-2",
                      Object.values(tempColumnVisibility).every(Boolean)
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "border-green-500 hover:bg-gray-500"
                    )}
                    onClick={() => {
                      const allVisible =
                        Object.values(tempColumnVisibility).every(Boolean);
                      const newVisibility = table
                        .getAllColumns()
                        .reduce((acc, column) => {
                          if (column.getCanHide()) acc[column.id] = !allVisible;
                          return acc;
                        }, {} as VisibilityState);
                      setTempColumnVisibility(newVisibility);
                    }}
                  >
                    {Object.values(tempColumnVisibility).every(Boolean)
                      ? "Deselect All"
                      : "Select All"}
                  </Button>
                  <Button
                    variant="outline"
                    size="custom"
                    className="px-2"
                    onClick={() => {
                      const ids = table
                        .getAllColumns()
                        .map((c) => c.id)
                        .filter((id) => id !== "select" && id !== "actions");
                      setTempColumnOrder(ids);
                      toast("✅ Order reset Successfully");
                    }}
                  >
                    Reset
                  </Button>
                </div>

                <ScrollArea className="flex-1 text-foreground p-2 mt-3 overflow-auto">
                  <div className="px-2 mb-2 text-sm text-muted-foreground">
                    Drag to reorder. Disabled checkboxes mean the column cannot
                    be hidden.
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) => {
                      const { active, over } = e;
                      if (!over || active.id === over.id) return;
                      const oldIndex = tempColumnOrder.indexOf(
                        active.id as string
                      );
                      const newIndex = tempColumnOrder.indexOf(
                        over.id as string
                      );
                      if (oldIndex !== -1 && newIndex !== -1)
                        setTempColumnOrder((prev) =>
                          arrayMove(prev, oldIndex, newIndex)
                        );
                    }}
                  >
                    <SortableContext
                      items={tempColumnOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2 p-1">
                        {(() => {
                          const allIds = table
                            .getAllColumns()
                            .map((c) => c.id)
                            .filter(
                              (id) => id !== "select" && id !== "actions"
                            );
                          let order =
                            tempColumnOrder && tempColumnOrder.length
                              ? [...tempColumnOrder]
                              : [...allIds];
                          const missing = allIds.filter(
                            (id) => !order.includes(id)
                          );
                          if (missing.length) order = [...order, ...missing];
                          const finalOrder = order.filter(
                            (id) => id !== "select" && id !== "actions"
                          );
                          return finalOrder.map((colId) => {
                            const column = table
                              .getAllColumns()
                              .find((c) => c.id === colId);
                            if (!column) return null;
                            const canHide = column.getCanHide();
                            const header =
                              typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id;
                            return (
                              <SortableItem key={colId} id={colId}>
                                <div className="flex items-center gap-3 rounded-md p-3 bg-background/50 hover:bg-muted/50 border border-border">
                                  <div className="cursor-grab px-2 text-muted-foreground">
                                    <GripVertical className="w-4 h-4" />
                                  </div>
                                  <Checkbox
                                    id={colId}
                                    checked={
                                      tempColumnVisibility[colId] ?? true
                                    }
                                    onCheckedChange={(value) => {
                                      if (!canHide) return;
                                      setTempColumnVisibility(
                                        (prev: VisibilityState) => ({
                                          ...prev,
                                          [colId]: !!value,
                                        })
                                      );
                                    }}
                                    disabled={!canHide}
                                    className="mr-2"
                                    aria-describedby={`${colId}-description`}
                                  />
                                  <div className="grow">
                                    <div className="font-medium capitalize">
                                      {header}
                                    </div>
                                  </div>
                                </div>
                              </SortableItem>
                            );
                          });
                        })()}
                      </div>
                    </SortableContext>
                  </DndContext>
                </ScrollArea>

                <DrawerFooter className="sticky bottom-0 bg-background p-3">
                  <Button
                    onClick={async () => {
                      setColumnVisibility(tempColumnVisibility);
                      setDrawerOpen(false);

                      try {
                        try {
                          const existing = table
                            .getAllColumns()
                            .map((c) => c.id);
                          let orderToApply = tempColumnOrder.filter((id) =>
                            existing.includes(id)
                          );
                          if (existing.includes("select")) {
                            orderToApply = [
                              "select",
                              ...orderToApply.filter((id) => id !== "select"),
                            ];
                          }
                          if (orderToApply.length)
                            table.setColumnOrder(orderToApply);
                        } catch (e) {
                          // ignore
                        }

                        const payload = {
                          tableName,
                          preferences: {
                            visibility: tempColumnVisibility,
                            order: tempColumnOrder,
                            sorting,
                          },
                        };

                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/preferences`,
                          {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            credentials: "include",
                            body: JSON.stringify(payload),
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
                    className="w-full"
                  >
                    <Save className="-ms-1 opacity-60 mr-2" size={16} />
                    Save
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
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
      {/* Table (visible at all sizes) — scroll horizontally on small viewports */}
      <div className="bg-background overflow-x-auto rounded-md border">
        <Table>
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
        {/* Table (visible at all sizes) — scroll horizontally on small viewports */}
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
