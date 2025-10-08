/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  useState,
  useEffect,
  useId,
  useRef,
  useMemo,
  useCallback,
} from "react";
import * as XLSX from "xlsx";
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
import { DialogTitle } from "@/components/ui/dialog";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  CirclePlus,
  Download,
  ChevronFirstIcon,
  ChevronLastIcon,
  GripVertical,
  X,
} from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";

import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { format } from "date-fns";

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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
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
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";

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

export default function RFpDataTable<TData, TValue>({
  columns,
  data,
  preferences,
}: DataTableProps<TData, TValue>) {
  const tableName = "RFpDataTable";

  const id = useId();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataTable, setDataTable] = useState(data);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    setDataTable(data);
    // mark that data has been received and applied
    setDataLoaded(true);
  }, [data]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    preferences || {}
  );
  const [tempColumnVisibility, setTempColumnVisibility] = useState(
    preferences || {}
  );
  const [tempColumnOrder, setTempColumnOrder] = useState<string[]>(
    (preferences && preferences.order) || []
  );
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [fetchedPreferences, setFetchedPreferences] = useState<any>(
    preferences || null
  );

  // Fetch preferences from server on mount (in case server-side prop doesn't include order)
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/get/preferences/${tableName}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!json.preferences) return;
        const prefs = json.preferences;
        // keep a local copy so other effects use the fetched prefs
        setFetchedPreferences(prefs);
        // prefs may be visibility object or { visibility, order }
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

          try {
            const finalOrder = [
              ...(table.getColumn("select") ? ["select"] : []),
              ...filtered,
              ...(table.getColumn("actions") ? ["actions"] : []),
            ];
            const allIds = table.getAllColumns().map((c) => c.id);
            const normalized = [
              ...finalOrder,
              ...allIds.filter((id) => !finalOrder.includes(id)),
            ];
            table.setColumnOrder(normalized as string[]);
          } catch (e) {
            // table might not be ready yet
          }
        }
        // apply sorting (if present) before showing the table to avoid flash
        if (prefs.sorting && Array.isArray(prefs.sorting)) {
          setSorting(prefs.sorting as SortingState);
        } else {
          // try client fallback from localStorage
          try {
            const key = `${tableName}-sorting`;
            const stored = localStorage.getItem(key);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) setSorting(parsed as SortingState);
            }
          } catch (e) {
            // ignore
          }
        }

        setPrefsLoaded(true);
      } catch (error) {
        console.error(" Error loading preferences:", error);
        // don't block rendering forever — allow table to render with defaults
        setPrefsLoaded(true);
      }
    };

    fetchPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  const table = useReactTable({
    data: dataTable,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { sorting, columnFilters, columnVisibility, globalFilter },
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
  // persist sorting locally as a fallback
  useEffect(() => {
    try {
      const key = `${tableName}-sorting`;
      localStorage.setItem(key, JSON.stringify(sorting || []));
    } catch (e) {
      // ignore
    }
  }, [sorting, tableName]);
  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  // when the Sheet opens, sync the tempColumnOrder from the table so draggable items
  // reflect the current column order immediately
  useEffect(() => {
    if (!open) return;
    const ids = table
      .getAllColumns()
      .map((c) => c.id)
      .filter((id) => id !== "select" && id !== "actions");
    // preserve any existing custom temp order but ensure it contains the current columns
    const base =
      tempColumnOrder && tempColumnOrder.length ? tempColumnOrder : ids;
    const normalized = [
      ...base,
      ...ids.filter((id) => !base.includes(id)),
    ].filter((id) => id !== "select" && id !== "actions");
    setTempColumnOrder(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, table]);

  // apply saved order once on load (wait for table columns to be ready)
  const columnsCount = table.getAllColumns().length;
  useEffect(() => {
    if (!preferences || prefsLoaded) return;
    if (columnsCount === 0) return; // wait until columns are initialized

    const savedOrder: string[] = preferences.order || [];
    if (savedOrder && savedOrder.length > 0) {
      const filtered = savedOrder.filter(
        (id) => id !== "select" && id !== "actions"
      );
      // ensure final ordering uses currently available columns
      const hasSelect = table.getAllColumns().some((c) => c.id === "select");
      const hasActions = table.getAllColumns().some((c) => c.id === "actions");
      const finalOrder = [
        ...(hasSelect ? ["select"] : []),
        ...filtered,
        ...(hasActions ? ["actions"] : []),
      ];
      const allIds = table.getAllColumns().map((c) => c.id);
      const normalized = [
        ...finalOrder,
        ...allIds.filter((id) => !finalOrder.includes(id)),
      ];
      try {
        table.setColumnOrder(normalized);
        // also sync the sheet temp order so the sheet matches the table
        setTempColumnOrder(filtered);
      } catch (e) {
        // ignore if cannot apply yet
      }
    }
  }, [preferences, columnsCount, prefsLoaded, table]);

  // compute the rendered order for the sheet; use tempColumnOrder when available
  const renderedOrder = useMemo(() => {
    const allIds = table
      .getAllColumns()
      .map((c) => c.id)
      .filter((id) => id !== "select" && id !== "actions");
    let order =
      tempColumnOrder && tempColumnOrder.length
        ? [...tempColumnOrder]
        : [...allIds];
    const missing = allIds.filter((id) => !order.includes(id));
    if (missing.length) order = [...order, ...missing];
    return order.filter((id) => id !== "select" && id !== "actions");
  }, [tempColumnOrder, table]);

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      setTempColumnOrder((prev) => {
        const current = prev && prev.length ? [...prev] : [...renderedOrder];
        const oldIndex = current.indexOf(active.id as string);
        const newIndex = current.indexOf(over.id as string);
        if (oldIndex === -1 || newIndex === -1) return current;
        return arrayMove(current, oldIndex, newIndex);
      });
    },
    [renderedOrder]
  );

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
  const exportToExcel = () => {
    const rows = table.getFilteredRowModel().rows;

    const data = rows.map((row) => {
      const rowData: any = {};
      row.getVisibleCells().forEach((cell) => {
        const col = cell.column.columnDef;

        if (col.id === "select") return;

        const header =
          typeof col.header === "string"
            ? col.header
            : col.id || `column_${cell.column.id}`;
        rowData[header] = cell.getValue();
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "FlowMeters");
    XLSX.writeFile(workbook, "flow-meters.xlsx");
  };

  if (!prefsLoaded || !dataLoaded) {
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
          {/* Filter by name or email */}
          <div className="relative">
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className={cn("peer min-w-auto ps-9")}
            />
          </div>

          {/* Toggle columns visibility: Sheet on sm+ screens, Drawer on xs */}
          <div className="hidden sm:block">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-green-500">
                  <Columns3Icon className="-ms-1 opacity-60" size={16} />
                  View
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-96">
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
                <ScrollArea className="h-[70vh] text-foreground p-2 mt-3">
                  <div className="px-2 mb-2 text-sm text-muted-foreground">
                    Drag to reorder. Disabled checkboxes mean the column cannot
                    be hidden.
                  </div>

                  <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis]}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    {
                      // compute the rendered order so SortableContext `items` matches
                      (() => {
                        const allIds = table
                          .getAllColumns()
                          .map((c) => c.id)
                          .filter((id) => id !== "select" && id !== "actions");
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

                        return (
                          <SortableContext
                            items={finalOrder}
                            strategy={verticalListSortingStrategy}
                          >
                            <div className="space-y-2 p-1">
                              {finalOrder.map((colId) => {
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
                              })}
                            </div>
                          </SortableContext>
                        );
                      })()
                    }
                  </DndContext>
                </ScrollArea>
                <Button
                  onClick={async () => {
                    setColumnVisibility(tempColumnVisibility);
                    setOpen(false);
                    try {
                      try {
                        const existing = table.getAllColumns().map((c) => c.id);
                        let orderToApply = tempColumnOrder.filter((id) =>
                          existing.includes(id)
                        );
                        if (existing.includes("select"))
                          orderToApply = [
                            "select",
                            ...orderToApply.filter((id) => id !== "select"),
                          ];
                        if (orderToApply.length)
                          table.setColumnOrder(orderToApply);
                      } catch (e) {}

                      const payload = {
                        tableName,
                        preferences: {
                          visibility: tempColumnVisibility,
                          order: tempColumnOrder,
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
              <DrawerContent>
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

                <ScrollArea className="h-[70vh] text-foreground p-2 mt-3">
                  <div className="px-2 mb-2 text-sm text-muted-foreground">
                    Drag to reorder. Disabled checkboxes mean the column cannot
                    be hidden.
                  </div>
                  <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis]}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    {(() => {
                      const allIds = table
                        .getAllColumns()
                        .map((c) => c.id)
                        .filter((id) => id !== "select" && id !== "actions");
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
                      return (
                        <SortableContext
                          items={finalOrder}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-2 p-1">
                            {finalOrder.map((colId) => {
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
                            })}
                          </div>
                        </SortableContext>
                      );
                    })()}
                  </DndContext>
                </ScrollArea>

                <DrawerFooter>
                  <div className="w-full flex justify-end">
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
                            if (existing.includes("select"))
                              orderToApply = [
                                "select",
                                ...orderToApply.filter((id) => id !== "select"),
                              ];
                            if (orderToApply.length)
                              table.setColumnOrder(orderToApply);
                          } catch (e) {}
                          const payload = {
                            tableName,
                            preferences: {
                              visibility: tempColumnVisibility,
                              order: tempColumnOrder,
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
                    >
                      Save
                    </Button>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <Button
            variant="outline"
            className="border-green-500"
            onClick={exportToExcel}
          >
            <Download className="-ms-1 opacity-60" size={16} />
            Export
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/flow-meter-form">
            <Button className="ml-auto" variant={"custom"}>
              <CirclePlus
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Add New Flow-meter
            </Button>
          </Link>
        </div>
      </div>
      {/* Table: desktop on lg+, responsive cards on sm/md */}
      <>
        {/* Desktop / large screens: regular table */}
        <div className="hidden lg:block bg-background overflow-hidden rounded-md border">
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

        {/* Small / medium screens: card list (1 column on sm, 2 columns on md) */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              // explicit fields in requested order
              const rfpId = (row.original as any)?.generalInfo?.rfpId ?? "";
              const rfpReference = row.getValue("RfpReference") as
                | string
                | undefined;
              const typeOfRfp = row.getValue("typeOfRfp") as string | undefined;
              const startDateRaw = row.getValue("startDate") as
                | string
                | undefined;
              const completionDateRaw = row.getValue("completionDate") as
                | string
                | undefined;
              const startDate = startDateRaw
                ? format(new Date(startDateRaw), "dd/MM/yyyy")
                : "";
              const completionDate = completionDateRaw
                ? format(new Date(completionDateRaw), "dd/MM/yyyy")
                : "";

              const items = [
                { label: "RFP Id", value: rfpId },
                { label: "RFP Reference", value: rfpReference ?? "" },
                { label: "Type", value: typeOfRfp ?? "" },
                { label: "Start Date", value: startDate },
                { label: "Completion Date", value: completionDate },
              ];

              return (
                <div
                  key={row.id}
                  className="bg-background rounded-lg border p-8 shadow-sm hover:shadow-md transition-shadow relative "
                >
                  <div className="flex items-start justify-between gap-1 md:gap-4">
                    <div className="flex-1">
                      <div className="space-y-2">
                        {items.map((it) => (
                          <div
                            key={it.label}
                            className="flex items-center justify-between"
                          >
                            <div className="text-sm font-semibold text-muted-foreground">
                              {it.label}
                            </div>
                            <div className="text-sm text-foreground ml-2 text-right line-clamp-1">
                              {it.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {row
                        .getVisibleCells()
                        .find((c) => c.column.id === "actions") ? (
                        <div className="absolute top-0 right-2">
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
            <div className="bg-background overflow-hidden rounded-md border p-8 col-span-2">
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full mb-2" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
          )}
        </div>
      </>

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
