"use client";

import { db, storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  doc,
  serverTimestamp,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import DZ from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const Dropzone = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const MAX_FILE_SIZE = 20971520;

  const checkFileName = async (baseName: string, ext: string, userId: any) => {
    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const safeBaseName = escapeRegex(baseName);
    const safeExt = escapeRegex(ext);

    const filesRef = collection(db, "users", userId, "files");

    const snapshot = await getDocs(filesRef);
    const fileNames = snapshot.docs.map((doc) => doc.data().fileName);

    const matchingNames = fileNames.filter((name) =>
      new RegExp(`^${safeBaseName}(\\(\\d+\\))?${safeExt}$`).test(name),
    );

    const hasOriginal = matchingNames.includes(`${baseName}${ext}`);

    const numbersInUse = matchingNames
      .map((name) => {
        const match = name.match(
          new RegExp(`^${safeBaseName}\\((\\d+)\\)${safeExt}$`),
        );
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n): n is number => Number.isInteger(n))
      .sort((a, b) => a - b);

    const missingIndex = numbersInUse.findIndex((num, i) => num !== i + 1);
    const nextNumber =
      missingIndex !== -1 ? missingIndex + 1 : numbersInUse.length + 1;

    return !hasOriginal
      ? `${baseName}${ext}`
      : `${baseName}(${nextNumber})${ext}`;
  };

  const uploadFile = async (file: File) => {
    if (loading || !user) return;

    const ext = file.name.split(".").pop();
    const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");

    setLoading(true);
    const toastId = toast.loading("Uploading file...");

    try {
      const newFileName = await checkFileName(
        fileNameWithoutExt,
        `.${ext}`,
        user.id,
      );
      const fileId = `${fileNameWithoutExt}-${uuidv4()}.${ext}`;
      const storageRef = ref(storage, `users/${user.id}/files/${fileId}`);

      const snapshot = await uploadBytes(storageRef, file);
      const URL = await getDownloadURL(storageRef);
      const docRef = doc(db, "users", user.id, "files", fileId);
      const data = {
        userId: user.id,
        fileName: newFileName,
        fullName: user.fullName,
        timestamp: serverTimestamp(),
        type: file.type,
        size: file.size,
        downloadURL: URL,
      };

      await setDoc(docRef, data);
      toast.success("File uploaded successfully!", {
        id: toastId,
        duration: 1500,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file!", {
        id: toastId,
        duration: 1500,
      });
    }

    setLoading(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large!`, {
          duration: 2500,
        });
        return;
      }
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        await uploadFile(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <DZ minSize={0} onDrop={onDrop}>
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
