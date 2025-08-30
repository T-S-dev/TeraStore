"use client";

import { useUser } from "@clerk/nextjs";
import { collection, orderBy, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/client";
import { useCollection } from "react-firebase-hooks/firestore";

import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/Table";

import { db } from "@/lib/firebase/client";
import { fileConverter } from "@/lib/firebase/converters";

const TableWrapper = () => {
  const { user: clerkUser } = useUser();
  const [firebaseUser] = useAuthState(auth);

  const [docs] = useCollection(
    clerkUser && firebaseUser
      ? query(collection(db, "users", clerkUser.id, "files"), orderBy("timestamp", "desc")).withConverter(fileConverter)
      : null,
  );

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

  const files = docs.docs.map((doc) => doc.data());

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="ml-2 text-xl font-bold">Files</h2>
      </div>
      <DataTable columns={columns} data={files}></DataTable>
    </div>
  );
};

export default TableWrapper;
