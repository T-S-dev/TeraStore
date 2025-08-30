import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { db, storage } from "@/lib/firebase/client";

const checkFileName = async (baseName: string, ext: string, userId: any) => {
  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const safeBaseName = escapeRegex(baseName);
  const safeExt = escapeRegex(ext);

  const filesRef = collection(db, "users", userId, "files");

  const snapshot = await getDocs(filesRef);
  const fileNames = snapshot.docs.map((doc) => doc.data().fileName);

  const matchingNames = fileNames.filter((name) => new RegExp(`^${safeBaseName}(\\(\\d+\\))?${safeExt}$`).test(name));

  const hasOriginal = matchingNames.includes(`${baseName}${ext}`);

  const numbersInUse = matchingNames
    .map((name) => {
      const match = name.match(new RegExp(`^${safeBaseName}\\((\\d+)\\)${safeExt}$`));
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((n): n is number => Number.isInteger(n))
    .sort((a, b) => a - b);

  const missingIndex = numbersInUse.findIndex((num, i) => num !== i + 1);
  const nextNumber = missingIndex !== -1 ? missingIndex + 1 : numbersInUse.length + 1;

  return !hasOriginal ? `${baseName}${ext}` : `${baseName}(${nextNumber})${ext}`;
};

export async function uploadFile(file: File, user: any) {
  if (!user) throw new Error("User is not authenticated.");

  const toastId = toast.loading("Uploading file...");

  try {
    const ext = `.${file.name.split(".").pop()}`;
    const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");

    const newFileName = await checkFileName(fileNameWithoutExt, ext, user.id);
    const fileId = `${fileNameWithoutExt}-${uuidv4()}${ext}`;
    const storageRef = ref(storage, `users/${user.id}/files/${fileId}`);

    const metadata = {
      contentDisposition: `attachment; filename="${newFileName}"`,
    };

    await uploadBytes(storageRef, file, metadata);

    const docRef = doc(db, "users", user.id, "files", fileId);
    await setDoc(docRef, {
      userId: user.id,
      fileName: newFileName,
      fullName: user.fullName,
      timestamp: serverTimestamp(),
      type: file.type,
      size: file.size,
      fullPath: storageRef.fullPath,
    });

    toast.success("File uploaded successfully!", { id: toastId });
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Error uploading file!", { id: toastId });
  }
}

export async function deleteFile(userId: string, fileId: string) {
  if (!userId || !fileId) return;

  const toastId = toast.loading("Deleting file...");

  try {
    const fileRef = ref(storage, `users/${userId}/files/${fileId}`);
    const docRef = doc(db, "users", userId, "files", fileId);

    await deleteObject(fileRef);
    await deleteDoc(docRef);

    toast.success("File deleted successfully!", { id: toastId });
  } catch (error) {
    console.error("Error deleting file:", error);
    toast.error("Error deleting file!", { id: toastId });
  }
}

export async function renameFile(userId: string, fileId: string, newFileName: string) {
  if (!userId || !fileId || !newFileName.trim()) return;

  const toastId = toast.loading("Renaming file...");

  try {
    const docRef = doc(db, "users", userId, "files", fileId);
    await updateDoc(docRef, {
      fileName: newFileName,
    });
    toast.success("File renamed successfully!", { id: toastId });
  } catch (error) {
    console.error("Error renaming file:", error);
    toast.error("Error renaming file!", { id: toastId });
  }
}
