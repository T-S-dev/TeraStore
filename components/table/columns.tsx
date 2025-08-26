"use client";

import Link from "next/link";
import { ArrowUpDown, Pen } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { FileIcon } from "react-file-icon";
import { ColumnDef } from "@tanstack/react-table";

import { useAppStore } from "@/store/store";
import { FileType } from "@/types";

export const fileTypeColors: { [key: string]: string } = {
  pdf: "#FF0000", // Red for PDFs
  doc: "#0000FF", // Blue for Docs
  docx: "#0000FF", // Blue for Docx
  txt: "#00FF00", // Green for Text files
  png: "#FFA500", // Orange for PNGs
  jpg: "#FFFF00", // Yellow for JPGs
  jpeg: "#FFFF00", // Yellow for JPEGs
  gif: "#FF00FF", // Magenta for GIFs
  mp3: "#800080", // Purple for MP3s
  mp4: "#800080", // Purple for MP4s
  mov: "#800080", // Purple for MOVs
  avi: "#800080", // Purple for AVIs
  csv: "#FFD700", // Gold for CSVs
  xls: "#008000", // Green for XLS
  xlsx: "#008000", // Green for XLSX
  ppt: "#800000", // Maroon for PPT
  pptx: "#800000", // Maroon for PPTX
  zip: "#A52A2A", // Brown for ZIPs
  rar: "#A52A2A", // Brown for RARs
  tar: "#A52A2A", // Brown for TARs
  gz: "#A52A2A", // Brown for GZs
};

export const fileTextColors: { [key: string]: string } = {
  txt: "#000000", // Black for Text files
  png: "#000000", // Black for PNGs
  jpg: "#000000", // Black for JPGs
  jpeg: "#000000", // Black for JPEGs
  csv: "#000000", // Black for CSVs
};

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <button
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ renderValue, ...props }) => {
      const type = renderValue() as string;
      const ext = type.split("/")[1];
      return (
        <div className="w-10">
          <FileIcon extension={ext} labelColor={fileTypeColors[ext]} labelTextColor={fileTextColors[ext]} />
        </div>
      );
    },
  },
  {
    accessorKey: "fileName",
    header: ({ column }) => {
      return (
        <button
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Filename
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ renderValue, ...props }) => {
      const { setFileId, setFileName, setIsRenameModalOpen } = useAppStore();
      const openRenameModal = (id: string, name: string) => {
        setFileId(id);
        setFileName(name);
        setIsRenameModalOpen(true);
      };

      return (
        <div
          className="flex w-fit max-w-xs cursor-pointer items-center space-x-2 border-white hover:border-b"
          onClick={() => {
            openRenameModal(props.row.original.id, props.row.original.fileName);
          }}
        >
          <span>{renderValue() as string}</span>
          <Pen width={15} />
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <button
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ renderValue, ...props }) => {
      return (
        <div className="flex flex-col">
          <div> {new Date(renderValue() as string).toLocaleDateString()}</div>
          <div className="text-xs text-gray-600 dark:text-gray-500">
            {new Date(renderValue() as string).toLocaleTimeString()}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <button
          className="flex cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </button>
      );
    },
    cell: ({ renderValue, ...props }) => {
      return <span>{prettyBytes(renderValue() as number)}</span>;
    },
  },
  {
    accessorKey: "downloadURL",
    header: "Link",
    cell: ({ renderValue, ...props }) => {
      return (
        <Link
          href={(renderValue() as string) || ""}
          target="_blank"
          prefetch={false}
          className="text-blue-500 underline hover:text-blue-600"
        >
          Download
        </Link>
      );
    },
  },
];
