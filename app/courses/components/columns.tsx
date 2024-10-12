"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

import {Course} from "@/lib/course/types";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "origin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Origin Language" />
    ),
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("origin")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "target",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Target Language" />
    ),
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("target")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => <div className="w-[240px]">{row.getValue("description")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "prompt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prompt" />
    ),
    cell: ({ row }) => <div className="w-[240px]">{row.getValue("prompt")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => <div className="w-[200px]">{row.getValue("updatedAt")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
