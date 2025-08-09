import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

import { FileType } from "@/types";

export const fileConverter: FirestoreDataConverter<FileType> = {
  toFirestore(file: FileType): DocumentData {
    return { ...file };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): FileType {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      fileName: data.fileName,
      fullName: data.fullName,
      timestamp: new Date(data.timestamp?.seconds * 1000),
      downloadURL: data.downloadURL,
      type: data.type,
      size: data.size,
    };
  },
};
