'use client'
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Group } from "@/types";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./RowActions";
const statusColor = {
  Create: "bg-green-500",
  Read: "bg-blue-400",
  Update: "bg-yellow-500",
  Delete: "bg-red-600",
} as const;

const statusColorInactive = {
  Create: "bg-gray-400",
  Read: "bg-gray-400",
  Update: "bg-gray-400",
  Delete: "bg-gray-400",
} as const;
export const columns: ColumnDef<Group>[] = [
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
    header: "Groups",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="font-semibold">{row.original.name}</div>
    ),
    size: 200,
  },

  {
    header: "Table",
    id: "tables",
    cell: ({ row }) => (
      <div className="divide-y divide-border">
        {row.original.tablePermissions?.map((table) => (
          <div key={table.id} className="py-1.5 text-sm font-medium">
            {table.tableName}
          </div>
        ))}
      </div>
    ),
  },

  {
    header: "Actions",
    id: "crud",
    cell: ({ row }) => (
      <div className="divide-y divide-border">
        {row.original.tablePermissions?.map((table) => (
          <div key={table.id} className="flex flex-wrap gap-1 py-1.5">
            {[
              { label: "Create", value: table.canCreate },
              { label: "Read", value: table.canRead },
              { label: "Update", value: table.canUpdate },
              { label: "Delete", value: table.canDelete },
            ].map((action) => (
              <Badge
                key={action.label}
                className={`text-white text-[11px] px-2 py-0.5 rounded-md ${
                  action.value
                    ? statusColor[action.label as keyof typeof statusColor]
                    : statusColorInactive[action.label as keyof typeof statusColorInactive]
                }`}
              >
                {action.label}
              </Badge>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];
