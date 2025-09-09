import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export async function renameFile(userId: string, fileId: string, newFileName: string) {
  if (!userId || !fileId || !newFileName.trim()) {
    throw new Error("Missing required parameters for renaming file");
  }

  const docRef = doc(db, "users", userId, "files", fileId);
  await updateDoc(docRef, { fileName: newFileName });
}
