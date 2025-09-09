"use client";

import { ArrowUpDown, Pen } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { FileIcon } from "react-file-icon";
import { ColumnDef, CellContext, Row } from "@tanstack/react-table";

import { useAppStore } from "@/store/store";
import { FileType } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { getDownloadURLAction } from "@/actions/getDownloadUrl";

export const fileTypeColors: { [key: string]: string } = {
  pdf: "#FF0000",
  doc: "#0000FF",
  docx: "#0000FF",
  plain: "#00FF00", // txt
  png: "#FFA500",
  jpg: "#FFFF00",
  jpeg: "#FFFF00",
  gif: "#FF00FF",
  mp3: "#800080",
  mp4: "#800080",
  mov: "#800080",
  avi: "#800080",
  csv: "#FFD700",
  xls: "#008000",
  xlsx: "#008000",
  ppt: "#800000",
  pptx: "#800000",
  zip: "#A52A2A",
  rar: "#A52A2A",
  tar: "#A52A2A",
  gz: "#A52A2A",
};

const FileNameCell = ({ row, getValue }: CellContext<FileType, unknown>) => {
  const { setFileId, setFileName, setIsRenameModalOpen } = useAppStore();

  const openRenameModal = (id: string, name: string) => {
    setFileId(id);
    setFileName(name);
    setIsRenameModalOpen(true);
  };

  const fileName = getValue() as string;
  const { id } = row.original;

  return (
    <div
      className="flex w-fit max-w-xs cursor-pointer items-center space-x-2 border-white hover:border-b"
      onClick={() => openRenameModal(id, fileName)}
    >
      <span>{fileName}</span>
      <Pen width={15} />
    </div>
  );
};

const DownloadCell = ({ row }: { row: Row<FileType> }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const result = await getDownloadURLAction(row.original.id);
    setLoading(false);

    if (result.success) {
      const link = document.createElement("a");
      link.href = result.data.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error(result.error);
      toast.error(`Error: ${result.error}`);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="cursor-pointer text-blue-500 underline hover:text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
    >
      Download
    </button>
  );
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
          <FileIcon extension={ext} labelColor={fileTypeColors[ext]} labelTextColor="black" />
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
    cell: FileNameCell,
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
    header: "Link",
    cell: ({ row }) => <DownloadCell row={row} />,
  },
];
