import { collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { db, storage } from "@/lib/firebase/client";
import { UserResource } from "@clerk/types";

const checkFileName = async (baseName: string, ext: string, userId: string) => {
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

export async function uploadFile(file: File, user: UserResource) {
  if (!user) throw new Error("User is not authenticated.");

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

  return newFileName;
}
