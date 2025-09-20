"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { RFP } from "@/types"; // make sure this matches your actual path
import RowActions from "./row-actions";
import { format } from "date-fns";

export const columns: ColumnDef<RFP>[] = [
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
    header: "RFP Reference",
    accessorKey: "RfpReference",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("RfpReference")}</div>
    ),
  },
  {
    header: "Type",
    accessorKey: "typeOfRfp",
    cell: ({ row }) => <div>{row.getValue("typeOfRfp")}</div>,
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
    cell: ({ row }) => {
      const date = row.getValue("startDate") as string;
      return <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>;
    },
  },
  {
    header: "Completion Date",
    accessorKey: "completionDate",
    cell: ({ row }) => {
      const date = row.getValue("completionDate") as string;
      return <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>;
    },
  },
  {
    header: "Panel Meeting Date",
    accessorFn: (row) => row.approvalDetails.panelAppealMeeting,
    cell: ({ row }) => {
      const date = row.original.approvalDetails.panelAppealMeeting;
      return <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>;
    },
  },

  {
    header: "Panel Decision Date",
    accessorFn: (row) => row.approvalDetails.panelAppealDecisionDate,
    cell: ({ row }) => {
      const date = row.original.approvalDetails.panelAppealDecisionDate;
      return <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>;
    },
  },
  // {
  //   header: "Location Type",
  //   accessorKey: "LocationType",
  //   cell: ({ row }) => <div>{row.getValue("LocationType")}</div>,
  // },
  {
    header: "RFP Id",
    accessorFn: (row) => row.generalInfo.rfpId,
    id: "rfpId",
    cell: ({ row }) => <div>{row.original.generalInfo.rfpId}</div>,
  },
  {
    header: "Address",
    accessorFn: (row) => row.generalInfo.address,
    id: "address",
    cell: ({ row }) => <div>{row.original.generalInfo.address}</div>,
  },
  {
    header: "Contact Number",
    accessorFn: (row) => row.generalInfo.contactNumber,
    id: "ContactNumber",
    cell: ({ row }) => <div>{row.original.generalInfo.contactNumber}</div>,
  },
  {
    header: "Report Date",
    accessorFn: (row) => row.generalInfo.reportDate,
    id: "ReportDate",
    cell: ({ row }) => {
      const date = row.original.generalInfo.reportDate;
      return <div>{date ? format(new Date(date), "dd/MM/yyyy") : ""}</div>;
    },
  },
  {
    header: "Report Ref",
    accessorFn: (row) => row.generalInfo.reportRef,
    id: "ReportRef",
    cell: ({ row }) => <div>{row.original.generalInfo.reportRef}</div>,
  },
  {
    header: "Responsible Position",
    accessorFn: (row) => row.generalInfo.responsiblePosition,
    id: "ResponsiblePosition",
    cell: ({ row }) => (
      <div>{row.original.generalInfo.responsiblePosition}</div>
    ),
  },
  {
    header: "Licensee",
    accessorFn: (row) => row.generalInfo.licensee,
    id: "licensee",
    cell: ({ row }) => <div>{row.original.generalInfo.licensee}</div>,
  },
  {
    header: "Region",
    accessorFn: (row) => row.location.region,
    id: "region",
    cell: ({ row }) => <div>{row.original.location.region}</div>,
  },
  // generalInfo
  {
    header: "Responsible Department",
    accessorFn: (row) => row.generalInfo.responsibleDepartment,
    id: "responsibleDepartment",
    cell: ({ row }) => (
      <div>{row.original.generalInfo.responsibleDepartment}</div>
    ),
  },
  {
    header: "FM ID SCADA",
    accessorFn: (row) => row.generalInfo.fmIdScada,
    id: "fmIdScada",
    cell: ({ row }) => <div>{row.original.generalInfo.fmIdScada}</div>,
  },
  {
    header: "FM ID SWS Asset No",
    accessorFn: (row) => row.generalInfo.fmIdSwsAssetNo,
    id: "fmIdSwsAssetNo",
    cell: ({ row }) => <div>{row.original.generalInfo.fmIdSwsAssetNo}</div>,
  },
  {
    header: "Site Manager Name",
    accessorFn: (row) => row.generalInfo.siteManagerName,
    id: "siteManagerName",
    cell: ({ row }) => <div>{row.original.generalInfo.siteManagerName}</div>,
  },
  {
    header: "Fax Number",
    accessorFn: (row) => row.generalInfo.faxNumber,
    id: "faxNumber",
    cell: ({ row }) => <div>{row.original.generalInfo.faxNumber}</div>,
  },

  // location
  {
    header: "STPCC",
    accessorFn: (row) => row.location.stpcc,
    id: "stpcc",
    cell: ({ row }) => <div>{row.original.location.stpcc}</div>,
  },
  {
    header: "Location Description",
    accessorFn: (row) => row.location.description,
    id: "locationDescription",
    cell: ({ row }) => <div>{row.original.location.description}</div>,
  },
  {
    header: "Coordinate N",
    accessorFn: (row) => row.location.coordinateN,
    id: "coordinateN",
    cell: ({ row }) => <div>{row.original.location.coordinateN}</div>,
  },
  {
    header: "Coordinate E",
    accessorFn: (row) => row.location.coordinateE,
    id: "coordinateE",
    cell: ({ row }) => <div>{row.original.location.coordinateE}</div>,
  },
  {
    header: "Site Drawing Ref",
    accessorFn: (row) => row.location.siteDrawingRef,
    id: "siteDrawingRef",
    cell: ({ row }) => <div>{row.original.location.siteDrawingRef}</div>,
  },
  {
    header: "Flow Diagram Ref",
    accessorFn: (row) => row.location.flowDiagramRef,
    id: "flowDiagramRef",
    cell: ({ row }) => <div>{row.original.location.flowDiagramRef}</div>,
  },

  // data
  {
    header: "Manual Method",
    accessorFn: (row) => row.data.manualMethod,
    id: "manualMethod",
    cell: ({ row }) => <div>{row.original.data.manualMethod}</div>,
  },
  {
    header: "Data Logger",
    accessorFn: (row) => row.data.dataLogger,
    id: "dataLogger",
    cell: ({ row }) => <div>{row.original.data.dataLogger}</div>,
  },
  {
    header: "Remote Reading",
    accessorFn: (row) => row.data.remoteReading,
    id: "remoteReading",
    cell: ({ row }) => <div>{row.original.data.remoteReading}</div>,
  },
  {
    header: "Outstation Details",
    accessorFn: (row) => row.data.outstationDetails,
    id: "outstationDetails",
    cell: ({ row }) => <div>{row.original.data.outstationDetails}</div>,
  },
  {
    header: "Storage Details",
    accessorFn: (row) => row.data.storageDetails,
    id: "storageDetails",
    cell: ({ row }) => <div>{row.original.data.storageDetails}</div>,
  },
  {
    header: "UB Report",
    accessorFn: (row) => row.data.ubReport,
    id: "ubReport",
    cell: ({ row }) => <div>{row.original.data.ubReport}</div>,
  },
  {
    header: "UB Value",
    accessorFn: (row) => row.data.ubValue,
    id: "ubValue",
    cell: ({ row }) => <div>{row.original.data.ubValue}</div>,
  },
  {
    header: "Data Management Procedure",
    accessorFn: (row) => row.data.dataManagementProcedure,
    id: "dataManagementProcedure",
    cell: ({ row }) => <div>{row.original.data.dataManagementProcedure}</div>,
  },

  // maf
  {
    header: "MAF Detail",
    accessorFn: (row) => row.maf.detail,
    id: "mafDetail",
    cell: ({ row }) => <div>{row.original.maf.detail}</div>,
  },
  {
    header: "MAF SOP Ref",
    accessorFn: (row) => row.maf.sopRef,
    id: "mafSopRef",
    cell: ({ row }) => <div>{row.original.maf.sopRef}</div>,
  },
  {
    header: "Selection Summary",
    accessorFn: (row) => row.maf.selectionSummary,
    id: "selectionSummary",
    cell: ({ row }) => <div>{row.original.maf.selectionSummary}</div>,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    size: 60,
    enableHiding: false,
  },
];
