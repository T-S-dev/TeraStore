"use client";

import { FileType } from "@/types";
import { columns } from "./columns";
import { DataTable } from "./Table";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const TableWrapper = () => {
  const { user } = useUser();
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);

  const [docs] = useCollection(
    user &&
      query(
        collection(db, "users", user.id, "files"),
        orderBy("timestamp", "desc"),
      ),
  );

  useEffect(() => {
    if (!docs) return;
    const files: FileType[] = docs.docs.map((doc) => ({
      id: doc.id,
      fileName: doc.data().fileName,
      fullName: doc.data().fullName,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000),
      downloadURL: doc.data().downloadURL,
      type: doc.data().type,
      size: doc.data().size,
    }));
    setInitialFiles(files);
  }, [docs]);

  if (!docs) {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="ml-2 text-xl font-bold">Files</h2>
        </div>
        <div className="rounded-lg border border-gray-600">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex w-full items-center space-x-4 p-5">
              <Skeleton className="h-12 w-[6%]" />
              <Skeleton className="h-12 w-[15%]" />
              <Skeleton className="h-12 w-[49%]" />
              <Skeleton className="h-12 w-[15%]" />
              <Skeleton className="h-12 w-[15%]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="ml-2 text-xl font-bold">Files</h2>
      </div>
      <DataTable columns={columns} data={initialFiles}></DataTable>
    </div>
  );
};

export default TableWrapper;
