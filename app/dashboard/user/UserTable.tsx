/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, useId, useRef, useLayoutEffect } from 'react';
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
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Columns3Icon,
  Plus,
  ChevronFirstIcon,
  ChevronLastIcon,
  GripVertical,
  X,
  Save,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';
import AddUser from '@/components/CRUD/Users/AddUser';
import Cookies from 'js-cookie';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';

interface DataTableProps<TData, TValue> {
  columns: any;
  data: TData[];
  preferences: any;
  token: string;
}

declare module '@tanstack/table-core' {
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

export default function UserTable<TData, TValue>({
  columns,
  data,
  preferences,
  token,
}: DataTableProps<TData, TValue>) {
  const tableName = 'Users';

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    preferences || {}
  );
  const [tempColumnVisibility, setTempColumnVisibility] = useState(
    preferences || {}
  );
  const [tempColumnOrder, setTempColumnOrder] = useState<string[]>(
    // preferences may include an order array
    (preferences && (preferences.order as string[])) || []
  );
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/get/preferences/${tableName}`,
          { method: 'GET', credentials: 'include' }
        );
        if (!res.ok) throw new Error('Failed to fetch preferences');
        const json = await res.json();
        if (json.preferences) {
          // json.preferences might be a visibility object or an object containing visibility + order
          const prefs = json.preferences;
          if (prefs.visibility) {
            setColumnVisibility(prefs.visibility);
            setTempColumnVisibility(prefs.visibility);
          } else {
            setColumnVisibility(prefs);
            setTempColumnVisibility(prefs);
          }
          if (prefs.order) {
            // ensure sheet order excludes select and actions
            const filtered = (prefs.order as string[]).filter(
              (id) => id !== 'select' && id !== 'actions'
            );
            setTempColumnOrder(filtered);
          }
          if (prefs.sorting) {
            setSorting(prefs.sorting as SortingState);
          }
          setPrefsLoaded(true);
        }
      } catch (error) {
        console.error(' Error loading preferences:', error);
      }
    };
    fetchPreferences();
  }, [tableName]);

  const id = useId();
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>(() => {
    try {
      const raw = localStorage.getItem(`${tableName}-sorting`);
      if (raw) return JSON.parse(raw) as SortingState;
    } catch (e) {
      // ignore
    }
    return [];
  });

  // Persist sorting locally so reloads keep the current sort as a fallback
  useEffect(() => {
    try {
      localStorage.setItem(`${tableName}-sorting`, JSON.stringify(sorting));
    } catch (e) {
      // ignore
    }
  }, [sorting, tableName]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dataTable, setDataTable] = useState(data);
  useEffect(() => {
    setDataTable(data);
  }, [data]);

  // Determine if we're ready to render the table: either prefs loaded from server,
  // we already have a sorting value from localStorage, or the data array is present.
  // Including the data array ensures an empty result set still renders the empty-state UI
  // on small/medium screens instead of the loading skeleton.
  const readyToRender =
    prefsLoaded || (sorting && sorting.length > 0) || Array.isArray(dataTable);

  // initialize column order from table if not provided by preferences
  useEffect(() => {
    // placeholder - will initialize after table is created
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

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
      touchAction: 'none',
    } as React.CSSProperties;

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  }

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

  // initialize column order from table if not provided by preferences
  useEffect(() => {
    try {
      const ids = table
        .getAllColumns()
        .map((c) => c.id)
        .filter((id) => id !== 'select' && id !== 'actions');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getAllColumns().length]);

  // Apply tempColumnOrder to the table whenever it changes so the visible table reflects the order
  useEffect(() => {
    try {
      if (tempColumnOrder && tempColumnOrder.length > 0) {
        // filter to only existing columns to avoid errors
        const existing = table.getAllColumns().map((c) => c.id);
        // Do not apply changes to the live table here. Order will be applied only when
        // preferences are loaded initially and when the user clicks Save.
        // This hook remains to track tempColumnOrder changes if needed elsewhere.
      }
    } catch (e) {
      // table may not be ready yet
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempColumnOrder]);

  // When preferences are loaded initially, apply saved order to the table once
  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      const existing = table.getAllColumns().map((c) => c.id);
      let orderToApply = tempColumnOrder.filter((id) => existing.includes(id));
      if (existing.includes('select')) {
        orderToApply = [
          'select',
          ...orderToApply.filter((id) => id !== 'select'),
        ];
      }
      if (orderToApply.length) table.setColumnOrder(orderToApply);
    } catch (e) {
      // ignore
    }
    // only run once after prefsLoaded flips to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsLoaded]);

  const [groups, setGroups] = useState<any[]>([]);
  // const token = Cookies.get("token");
  // console.log({token})
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // const token = Cookies.get("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/groups`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
            credentials: 'include',
          }
        );
        const data: any[] = await res.json();
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch groups', error);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search all columns..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={cn('peer min-w-auto ps-9')}
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
                      'flex-1 p-2',
                      Object.values(tempColumnVisibility).every(Boolean)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'border-green-500 hover:bg-gray-500'
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
                      ? 'Deselect All'
                      : 'Select All'}
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
                        .filter((id) => id !== 'select' && id !== 'actions');
                      setTempColumnOrder(ids);
                      toast('✅ Order reset Successfully');
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
                              (id) => id !== 'select' && id !== 'actions'
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
                            (id) => id !== 'select' && id !== 'actions'
                          );
                          return finalOrder.map((colId) => {
                            const column = table
                              .getAllColumns()
                              .find((c) => c.id === colId);
                            if (!column) return null;
                            const canHide = column.getCanHide();
                            const header =
                              typeof column.columnDef.header === 'string'
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
                        if (existing.includes('select')) {
                          orderToApply = [
                            'select',
                            ...orderToApply.filter((id) => id !== 'select'),
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
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          credentials: 'include',
                          body: JSON.stringify(payload),
                        }
                      );

                      if (!res.ok) {
                        toast.error(' Failed to save preferences');
                        return;
                      }

                      toast.success(' Preferences saved!');
                    } catch (error) {
                      toast.error(' Network error');
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
                      'flex-1 p-2',
                      Object.values(tempColumnVisibility).every(Boolean)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'border-green-500 hover:bg-gray-500'
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
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                  <Button
                    variant="outline"
                    size="custom"
                    className="px-2"
                    onClick={() => {
                      const ids = table
                        .getAllColumns()
                        .map((c) => c.id)
                        .filter((id) => id !== 'select' && id !== 'actions');
                      setTempColumnOrder(ids);
                      toast('✅ Order reset Successfully');
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
                              (id) => id !== 'select' && id !== 'actions'
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
                            (id) => id !== 'select' && id !== 'actions'
                          );
                          return finalOrder.map((colId) => {
                            const column = table
                              .getAllColumns()
                              .find((c) => c.id === colId);
                            if (!column) return null;
                            const canHide = column.getCanHide();
                            const header =
                              typeof column.columnDef.header === 'string'
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
                          if (existing.includes('select')) {
                            orderToApply = [
                              'select',
                              ...orderToApply.filter((id) => id !== 'select'),
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
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            credentials: 'include',
                            body: JSON.stringify(payload),
                          }
                        );

                        if (!res.ok) {
                          toast.error(' Failed to save preferences');
                          return;
                        }

                        toast.success(' Preferences saved!');
                      } catch (error) {
                        toast.error(' Network error');
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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant={'custom'}>
                {' '}
                <Plus style={{ height: 20, width: 20 }} /> Add New User
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="md:max-w-md">
              {/* Wrap children in a single parent element */}
              <div>
                <SheetHeader>
                  <SheetTitle> User Information</SheetTitle>
                  <SheetDescription
                    className={cn('mb-0 pb-0')}
                  ></SheetDescription>
                </SheetHeader>
                <AddUser />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Table: desktop on lg+, responsive cards on sm/md */}
      {readyToRender ? (
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
                            header.id === 'actions' ? 'sticky -right-[1px]' : ''
                          }`}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              role={
                                header.column.getCanSort()
                                  ? 'button'
                                  : undefined
                              }
                              tabIndex={
                                header.column.getCanSort() ? 0 : undefined
                              }
                              onClick={
                                header.column.getCanSort()
                                  ? header.column.getToggleSortingHandler()
                                  : undefined
                              }
                              onKeyDown={
                                header.column.getCanSort()
                                  ? (e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        header.column.getToggleSortingHandler()?.(
                                          e as any
                                        );
                                      }
                                    }
                                  : undefined
                              }
                              className={cn(
                                'flex items-center gap-2 cursor-pointer select-none',
                                header.column.getCanSort()
                                  ? 'hover:opacity-80'
                                  : ''
                              )}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() ? (
                                <span className="ml-2 text-sm text-muted-foreground">
                                  {header.column.getIsSorted() === 'asc'
                                    ? '▲'
                                    : header.column.getIsSorted() === 'desc'
                                    ? '▼'
                                    : ''}
                                </span>
                              ) : null}
                            </div>
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
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={`whitespace-nowrap ${
                            cell.column.id === 'actions'
                              ? 'sticky -right-[1px] text-center bg-background z-10'
                              : ''
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
                // Exclude select/actions and id from card fields
                const visible = row
                  .getVisibleCells()
                  .filter(
                    (c) =>
                      c.column.id !== 'select' &&
                      c.column.id !== 'actions' &&
                      c.column.id !== 'id'
                  );

                return (
                  <div
                    key={row.id}
                    className="bg-background rounded-lg border p-8 shadow-sm hover:shadow-md transition-shadow relative "
                  >
                    <div className="flex items-start justify-between gap-1 md:gap-4">
                      <div className="flex-1">
                        <div className="space-y-2">
                          {visible.map((cell) => (
                            <div
                              key={cell.id}
                              className="flex items-center justify-between"
                            >
                              <div className="text-sm font-semibold text-muted-foreground">
                                {typeof cell.column.columnDef.header ===
                                'string'
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
                        {/* actions cell (if present) */}
                        {row
                          .getVisibleCells()
                          .find((c) => c.column.id === 'actions') ? (
                          <div className="absolute top-0 right-2">
                            {flexRender(
                              row
                                .getVisibleCells()
                                .find((c) => c.column.id === 'actions')!.column
                                .columnDef.cell,
                              row
                                .getVisibleCells()
                                .find((c) => c.column.id === 'actions')!
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
      <div className="flex items-center justify-between gap-8">
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
            </span>{' '}
            of{' '}
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
