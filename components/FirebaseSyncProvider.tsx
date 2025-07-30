"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import {
  signInWithCustomToken,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/firebase";

export default function FirebaseSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const syncFirebase = async () => {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        await firebaseSignOut(auth);
        return;
      }

      try {
        const token = await getToken({ template: "integration_firebase" });
        if (token) {
          await signInWithCustomToken(auth, token);
        }
      } catch (e) {
        console.error("Firebase auth sync error:", e);
      }
    };

    syncFirebase();
  }, [isLoaded, isSignedIn, getToken]);

  return <>{children}</>;
}
