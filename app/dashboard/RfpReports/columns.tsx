"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import RowActions from "./row-actions";
import { Report } from "@/types";

export const columns: ColumnDef<Report>[] = [
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
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
    enableHiding: false,
  },
  {
    header: "Coverage Probability",
    accessorKey: "coverageProbability",
    cell: ({ row }) => {
      const value = row.getValue("coverageProbability") as number | undefined;
      return <div>{typeof value === "number" ? value.toFixed(2) : "-"}</div>;
    },
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>;
    },
  },
  {
    header: "Updated At",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as string;
      return <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>;
    },
  },
  {
    header: "RFP ID",
    accessorKey: "rfpId",
    cell: ({ row }) => <div>{row.getValue("rfpId")}</div>,
  },
  // {
  //   header: 'Created By',
  //   accessorKey: 'createdBy',
  //   cell: ({ row }) => <div>{row.getValue('createdBy')}</div>,
  // },
  // {
  //   header: 'Updated By',
  //   accessorKey: 'updatedBy',
  //   cell: ({ row }) => <div>{row.getValue('updatedBy')}</div>,
  // },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
];

// export const columns: ColumnDef<Report>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     size: 28,
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     header: 'Report ID',
//     accessorKey: 'reportId',
//     cell: ({ row }) => (
//       <div className="font-medium">{row.getValue('reportId')}</div>
//     ),
//   },
//   {
//     header: 'Report Name',
//     accessorKey: 'reportName',
//     cell: ({ row }) => <div>{row.getValue('reportName')}</div>,
//   },
//   {
//     header: 'Report Type',
//     accessorKey: 'reportType',
//     cell: ({ row }) => <div>{row.getValue('reportType')}</div>,
//   },
//   {
//     header: 'Created At',
//     accessorKey: 'createdAt',
//     cell: ({ row }) => {
//       const date = row.getValue('createdAt') as string;
//       return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
//     },
//   },
//   {
//     header: 'Author',
//     accessorKey: 'author',
//     cell: ({ row }) => <div>{row.getValue('author')}</div>,
//   },
//   {
//     header: 'Status',
//     accessorKey: 'status',
//     cell: ({ row }) => (
//       <div
//         className={`${
//           row.getValue('status') === 'Completed'
//             ? 'text-green-600'
//             : row.getValue('status') === 'In Progress'
//             ? 'text-blue-600'
//             : 'text-yellow-600'
//         } font-medium`}
//       >
//         {row.getValue('status')}
//       </div>
//     ),
//   },
//   {
//     id: 'actions',
//     cell: ({ row }) => <RowActions row={row} />,
//   },
// ];
