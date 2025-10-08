"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DeviceDB } from "@/types";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./row-actions";
export const columns: ColumnDef<DeviceDB>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    enableHiding: false,
    // size: 180,
    // filterFn: (row, _columnId, filterValue) => {
    //   const searchableRowContent =
    //     `${row.original.name}
    //      ${row.original.polling}
    //      ${row.original.type}
    //      ${row.original.description}
    //      ${row.original.enabled}`.toLowerCase();
    //   const searchTerm = (filterValue ?? "").toLowerCase();
    //   return searchableRowContent.includes(searchTerm);
    // },
    // enableHiding: false,
  },
  {
    header: "Polling",
    accessorKey: "polling",
    cell: ({ row }) => <div>{row.getValue("polling")}</div>,
    size: 220,
  },
  {
    header: " Type",
    accessorKey: "type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
    size: 120,
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
    size: 200,
  },
  {
    header: "Enabled",
    accessorKey: "enabled",
    cell: ({ row }) => {
      const enabled = row.getValue("enabled");
      return (
        <Badge
          className={
            enabled
              ? "bg-green-500 text-white hover:bg-green-500"
              : "bg-gray-500 text-white hover:bg-destructive"
          }
        >
          {enabled ? "Enabled" : "Disabled"}
        </Badge>
      );
    },
    size: 200,
  },
  {
    id: "actions",

    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];
