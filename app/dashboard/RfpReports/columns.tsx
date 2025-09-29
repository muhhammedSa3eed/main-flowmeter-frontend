'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import RowActions from './row-actions';

// type for report row
export type Report = {
  reportId: string;
  reportName: string;
  reportType: string;
  createdAt: string;
  author: string;
  status: string;
};

export const columns: ColumnDef<Report>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    header: 'Report ID',
    accessorKey: 'reportId',
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('reportId')}</div>
    ),
  },
  {
    header: 'Report Name',
    accessorKey: 'reportName',
    cell: ({ row }) => <div>{row.getValue('reportName')}</div>,
  },
  {
    header: 'Report Type',
    accessorKey: 'reportType',
    cell: ({ row }) => <div>{row.getValue('reportType')}</div>,
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return <div>{date ? format(new Date(date), 'dd/MM/yyyy') : ''}</div>;
    },
  },
  {
    header: 'Author',
    accessorKey: 'author',
    cell: ({ row }) => <div>{row.getValue('author')}</div>,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <div
        className={`${
          row.getValue('status') === 'Completed'
            ? 'text-green-600'
            : row.getValue('status') === 'In Progress'
            ? 'text-blue-600'
            : 'text-yellow-600'
        } font-medium`}
      >
        {row.getValue('status')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <RowActions row={row} />,
  },
];
