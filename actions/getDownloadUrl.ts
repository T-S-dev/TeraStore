"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb, adminStorage } from "@/lib/firebase/admin";

import { Action } from "@/types/actions";

export async function getDownloadURLAction(fileId: string): Action<{ url: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (!fileId) {
      return { success: false, error: "File ID is required" };
    }

    const fileRef = adminDb.collection("users").doc(userId).collection("files").doc(fileId);
    const doc = await fileRef.get();

    if (!doc.exists) {
      return { success: false, error: "File not found" };
    }

    const fileData = doc.data();
    if (fileData?.userId !== userId) {
      return { success: false, error: "Forbidden" };
    }

    // Generate a temporary URL that expires in 1 minute
    const [url] = await adminStorage.file(fileData?.fullPath).getSignedUrl({
      action: "read",
      expires: Date.now() + 1 * 60 * 1000,
    });

    return { success: true, data: { url } };
  } catch (error) {
    console.error("Error generating download link:", error);
    return { success: false, error: "An internal error occurred." };
  }
}
