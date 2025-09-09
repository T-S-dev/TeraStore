import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";

export async function deleteFile(userId: string, fileId: string) {
  if (!userId || !fileId) return;

  const fileRef = ref(storage, `users/${userId}/files/${fileId}`);
  const docRef = doc(db, "users", userId, "files", fileId);

  await deleteObject(fileRef);
  await deleteDoc(docRef);
}
