import { getApps, getApp, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "@/firebase_service_key.json";

const adminApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);
const adminStorage = getStorage(adminApp).bucket();

export { adminApp, adminDb, adminAuth, adminStorage };
