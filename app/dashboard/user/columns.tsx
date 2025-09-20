// columns.tsx
'use client'
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "./RowActions";
import { User } from "@/types";

const statusColor = {
  active: "bg-green-500",
  inactive: "bg-gray-400",
  suspended: "bg-yellow-500",
  pending: "bg-blue-500",
  banned: "bg-red-600",
} as const;

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },

  /* --------- Username --------- */
  {
    header: "Username",
    accessorKey: "username",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("username")}</div>
    ),
    size: 180,
    enableHiding: false,
    filterFn: (row, _id, value) => {
      const haystack = `${row.original.username} ${row.original.id}`.toLowerCase();
      return haystack.includes((value ?? "").toLowerCase());
    },
  },

  /* --------- Email --------- */
  {
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
    size: 220,
  },

  /* --------- Group  --------- */
  {
    id: "groupName",
    header: "Group",
    accessorFn: (row) => row.group?.name ?? "",
    cell: ({ cell }) => (
      <div className="font-medium">{cell.getValue<string>()}</div>
    ),
    size: 180,
  },

  /* --------- Status --------- */
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const value = (row.getValue("status") as string)?.toLowerCase() as keyof typeof statusColor;
      return (
        <Badge className={`${statusColor[value] ?? "bg-gray-500"} text-white capitalize`}>
          {value}
        </Badge>
      );
    },
    size: 120,
  },

  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];
