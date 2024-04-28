"use client";

import { useAuth } from "@clerk/nextjs";
import { signInWithCustomToken } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { useState, useEffect } from "react";
import { FileType } from "@/types";

const useDetails = () => {
  const { getToken, userId } = useAuth();

  const [skeletonFiles, setSkeletonFiles] = useState<FileType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await getToken({ template: "integration_firebase" });
        const userCredentials = await signInWithCustomToken(auth, token || "");

        const docs = await getDocs(collection(db, "users", userId!, "files"));

        const skeletonFiles: FileType[] = docs.docs.map((doc) => ({
          id: doc.id,
          fileName: doc.data().fileName,
          fullName: doc.data().fullName,
          timestamp: new Date(doc.data().timestamp?.seconds * 1000),
          downloadURL: doc.data().downloadURL,
          type: doc.data().type,
          size: doc.data().size,
        }));

        setSkeletonFiles(skeletonFiles);
      } catch (error: any) {
        console.error("Error fetching details:", error);
        setError(error.code);
      }
    };
    fetchDetails();
  }, []);

  return { skeletonFiles, error };
};

export default useDetails;
