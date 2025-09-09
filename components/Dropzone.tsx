"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import DZ from "react-dropzone";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { tryCatch } from "@/lib/tryCatch";
import { uploadFile } from "@/services/uploadFile";

const Dropzone = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        return toast.error(`File ${file.name} is too large!`);
      }
      if (!user) return;

      setLoading(true);
      const toastId = toast.loading(`Uploading ${file.name}...`);

      const [newFileName, error] = await tryCatch(uploadFile(file, user));

      if (error) {
        console.error("Upload error:", error);
        toast.error(`Error uploading ${file.name}`, { id: toastId });
      } else {
        toast.success(`File "${newFileName}" uploaded successfully!`, { id: toastId });
      }

      setLoading(false);
    });
  };

  return (
    <DZ minSize={0} onDrop={onDrop} disabled={loading}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
        return (
          <section className="mx-4 mt-6">
            <div
              {...getRootProps()}
              className={cn(
                "hover:bg-background-hover flex h-60 w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-600 dark:border-gray-300",
                isDragActive && "bg-background-hover animate-pulse",
              )}
            >
              <input {...getInputProps()} />

              {!isDragActive && "Click here or drop a file to upload!"}
              {isDragActive && !isDragReject && "Drop a file to upload"}
              {isDragReject && "File type not accepted, sorry!"}
            </div>
          </section>
        );
      }}
    </DZ>
  );
};

export default Dropzone;
