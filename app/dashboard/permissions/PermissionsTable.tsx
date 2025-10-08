/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useId, useLayoutEffect } from "react";
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
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  Plus,
  ChevronFirstIcon,
  ChevronLastIcon,
  GripVertical,
  X,
  CirclePlus,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { useCallback } from "react";

// dnd-kit imports for sortable sheet
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import AddGroup from "@/components/CRUD/Groups/AddGroup";

interface DataTableProps<TData, TValue> {
  columns: any;
  data: TData[];
  preferences: any;
}

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

function PermissionsTableInner<TData, TValue>({
  columns,
  data,
  preferences,
  // when true, the inner table will wait to display until initial sorting
  // is applied (useLayoutEffect ensures this happens before paint)
  waitForApply,
}: DataTableProps<TData, TValue> & { waitForApply?: boolean }) {
  const tableName = "Permissions";
  // hide id by default unless preferences specify otherwise
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    preferences || { id: false }
  );
  const [tempColumnVisibility, setTempColumnVisibility] = useState(
    preferences || { id: false }
  );
  const [tempColumnOrder, setTempColumnOrder] = useState<string[]>(
    (preferences && preferences.order) || []
  );

  const id = useId();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  // initialize sorting from server preferences when present so the table
  // is created with the saved sorting on first mount (avoids flash)
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

  // Persist sorting to localStorage so reloads keep the current sort
  useEffect(() => {
    try {
      localStorage.setItem(`${tableName}-sorting`, JSON.stringify(sorting));
    } catch (e) {
      // ignore
    }
  }, [sorting, tableName]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dataTable, setDataTable] = useState(data);
  useEffect(() => setDataTable(data), [data]);

  // Wrapper already waits for preferences; render table now.
  const readyToRender = true;
  const [applied, setApplied] = useState<boolean>(!waitForApply);

  // useLayoutEffect runs before paint — switch applied to true so the
  // table is rendered only after initial sorting has been applied to the
  // table's internal state, preventing a flash of default sorting.
  useLayoutEffect(() => {
    if (waitForApply) {
      setApplied(true);
    }
    // only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useReactTable({
    data: dataTable,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
      sorting,
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

  // sensors for dnd-kit
  const sensors = useSensors(useSensor(PointerSensor));

  // initialize temp order from table columns if not provided
  useEffect(() => {
    if (
      (preferences && preferences.order && preferences.order.length > 0) ||
      tempColumnOrder.length > 0
    )
      return;
    const initial = table
      .getAllColumns()
      .filter((c) => c.getCanHide())
      .map((c) => c.id);
    setTempColumnOrder(initial);
  }, [table, preferences, tempColumnOrder.length]);

  // apply saved order to the live table once on load
  useEffect(() => {
    if (!preferences) return;
    const savedOrder: string[] = preferences.order || [];
    if (savedOrder && savedOrder.length > 0) {
      const filtered = savedOrder.filter(
        (id) => id !== "select" && id !== "actions"
      );
      const finalOrder = [
        ...(table.getColumn("select") ? ["select"] : []),
        ...filtered,
        ...(table.getColumn("actions") ? ["actions"] : []),
      ];
      // normalize against current columns (append any missing)
      const allIds = table.getAllColumns().map((c) => c.id);
      const normalized = [
        ...finalOrder,
        ...allIds.filter((id) => !finalOrder.includes(id)),
      ];
      table.setColumnOrder(normalized);
    }

    // sorting is initialized from preferences at mount; no need to set it here
  }, [preferences, table]);

  // drag end handler
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setTempColumnOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

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

    // apply attributes & listeners on the container so the internal GripVertical
    // is purely visual and the whole item is draggable (matches UserTable)
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
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
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={cn("peer min-w-auto ps-9")}
          />

          {/* Toggle columns visibility: Sheet for sm+ screens */}
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
                      // reset order to table default (exclude select/actions from the sheet order)
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
                    onDragEnd={handleDragEnd}
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
                                    {(column.columnDef as any)?.meta
                                      ?.description ? (
                                      <div className="text-xs text-muted-foreground">
                                        {
                                          (column.columnDef as any).meta
                                            .description
                                        }
                                      </div>
                                    ) : null}
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
                {/* Provide a DialogTitle for accessibility tools (visually hidden) */}
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
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
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
                    className="w-full"
                  >
                    Save
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant={"custom"}>
                {" "}
                <CirclePlus
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />{" "}
                Add New Group
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="2xl:max-w-2xl">
              {/* Wrap children in a single parent element */}
              <div>
                <SheetHeader>
                  <SheetDescription
                    className={cn("mb-0 pb-0")}
                  ></SheetDescription>
                </SheetHeader>
                <AddGroup />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Table: desktop on lg+, responsive cards on sm/md */}
      {applied ? (
        <>
          {/* Table (shown on all sizes). On narrow screens it can scroll horizontally */}
          <div className="block bg-background overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => {
                      const isLast = i === headerGroup.headers.length - 1;
                      return (
                        <TableHead
                          key={header.id}
                          className={`whitespace-nowrap font-semibold text-black dark:text-white ${
                            !isLast ? "border-r" : ""
                          } ${
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
                      {row.getVisibleCells().map((cell, i) => {
                        const isLast = i === row.getVisibleCells().length - 1;
                        return (
                          <TableCell
                            key={cell.id}
                            className={`whitespace-nowrap ${
                              !isLast ? "border-r" : ""
                            } ${
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
                        );
                      })}
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

          {/* Card list is hidden when showing table on all sizes */}
          <div className="hidden">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const visible = row
                  .getVisibleCells()
                  .filter(
                    (c) =>
                      c.column.id !== "select" &&
                      c.column.id !== "actions" &&
                      c.column.id !== "id"
                  );

                return (
                  <div
                    key={row.id}
                    className="bg-background rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow relative "
                  >
                    <div className="flex items-start justify-between gap-1 md:gap-4 ">
                      <div className="flex-1">
                        <div className="space-y-2">
                          {visible.map((cell) => (
                            <div
                              key={cell.id}
                              className="flex items-center justify-between"
                            >
                              <div className="text-sm font-semibold text-muted-foreground">
                                {typeof cell.column.columnDef.header ===
                                "string"
                                  ? cell.column.columnDef.header
                                  : cell.column.id}
                              </div>
                              <div className="text-sm text-foreground ml-2 text-right line-clamp-1">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {row
                          .getVisibleCells()
                          .find((c) => c.column.id === "actions") ? (
                          <div className="absolute top-0 right-6">
                            {flexRender(
                              row
                                .getVisibleCells()
                                .find((c) => c.column.id === "actions")!.column
                                .columnDef.cell,
                              row
                                .getVisibleCells()
                                .find((c) => c.column.id === "actions")!
                                .getContext()
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-background overflow-hidden rounded-md border p-8 col-span-2 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-semibold text-muted-foreground">
                    No results.
                  </div>
                  <div className="text-xs text-muted-foreground">
                    There is no data to display.
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-background overflow-hidden rounded-md border p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-slate-100 rounded w-full mb-2" />
            <div className="h-4 bg-slate-100 rounded w-full mb-2" />
            <div className="h-4 bg-slate-100 rounded w-3/4" />
          </div>
        </div>
      )}
      {/* Pagination */}
      <div className="flex items-center justify-between gap-8 ">
        {/* Results per page */}
        <div className="flex items-center gap-3 p-3">
          <Label htmlFor={id} className="max-sm:sr-only ">
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
              {[5, 10].map((pageSize) => (
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

export default function PermissionsTable<TData, TValue>({
  columns,
  data,
  preferences,
}: DataTableProps<TData, TValue>) {
  const tableName = "Permissions";

  // Always fetch fresh preferences client-side and show the loader until the
  // fetch (and localStorage merge) completes. Even if `preferences` were
  // provided server-side, we still want to ensure client-side sorting is
  // resolved before rendering to avoid flash-to-default.
  const [loadedPrefs, setLoadedPrefs] = useState<any>(preferences || null);
  // If server passed preferences, don't show the initial client loading skeleton.
  const [loading, setLoading] = useState<boolean>(preferences ? false : true);

  // Debug: log incoming server props and initial loading to help diagnose
  // persistent loading on small screens. Remove in production.
  console.debug(
    "PermissionsTable: props.preferences =>",
    preferences,
    "initial loading=>",
    loading
  );

  useEffect(() => {
    // seed with passed preferences if any, but always fetch latest prefs
    if (preferences) setLoadedPrefs(preferences);

    let cancelled = false;
    const fetchPreferences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/get/preferences/${tableName}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) {
          return;
        }
        const json = await res.json();
        if (!json || !json.preferences) {
          return;
        }
        if (!cancelled) {
          // merge client sorting fallback if server didn't provide it
          try {
            const server = json.preferences || {};
            if (!server.sorting || !server.sorting.length) {
              const raw = localStorage.getItem(`${tableName}-sorting`);
              if (raw) {
                const clientSorting = JSON.parse(raw);
                server.sorting = clientSorting;
              }
            }
            setLoadedPrefs(server);
          } catch (e) {
            setLoadedPrefs(json.preferences);
          }
        }
      } catch (e) {
        // ignore network errors and continue
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // start fetch for fresh preferences from server. Only show the loading
    // skeleton if we don't already have server-provided preferences.
    if (!preferences) setLoading(true);
    fetchPreferences();

    return () => {
      cancelled = true;
    };
  }, [tableName, preferences]);

  // Only show the full-page loading skeleton when we're loading preferences
  // and we don't have any data to display. If data is present (for example
  // server-provided rows), render the table immediately and let preferences
  // hydrate in the background — this prevents mobile view from appearing to
  // be stuck loading while rows exist.
  if (loading && (!data || data.length === 0)) {
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
    <PermissionsTableInner
      columns={columns}
      data={data}
      preferences={
        // If server didn't return sorting, merge with localStorage sorting so
        // the table initializes with the user's last sorting on reload.
        (() => {
          try {
            const server = loadedPrefs || {};
            if (
              server &&
              (server as any).sorting &&
              (server as any).sorting.length
            )
              return server;
            const raw = localStorage.getItem(`${tableName}-sorting`);
            if (raw) {
              const clientSorting = JSON.parse(raw);
              return { ...server, sorting: clientSorting };
            }
            return server;
          } catch (e) {
            return loadedPrefs;
          }
        })()
      }
      waitForApply={true}
    />
  );
}
