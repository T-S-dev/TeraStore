// "use client";

import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

const RenameModal = () => {
  const { user } = useUser();
  const [newName, setNewName] = useState("");

  const { isRenameModalOpen, setIsRenameModalOpen, fileId, fileName } =
    useAppStore();

  const ext = fileName?.split(".").pop();
  const fileNameWithoutExt = fileName?.split(".").slice(0, -1).join(".");

  const renameFile = async () => {
    if (!user || !fileId || !newName.trim()) return;

    try {
      await updateDoc(doc(db, "users", user.id, "files", fileId), {
        fileName: newName + (ext ? `.${ext}` : ""),
      });
      toast.success("File renamed successfully!", {
        duration: 1500,
      });
    } catch (error) {
      toast.error("Error renaming file!", {
        duration: 1500,
      });
    } finally {
      setNewName("");
      setIsRenameModalOpen(false);
    }
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModalOpen(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">Rename the File</DialogTitle>

          <Input
            id="link"
            className="focus:border-none"
            defaultValue={fileNameWithoutExt as string}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDownCapture={(e) => {
              if (e.key === "Enter") {
                renameFile();
              }
            }}
          />

          <div className="flex justify-end space-x-2 py-3">
            <Button
              variant="outline"
              onClick={() => setIsRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={renameFile}>
              Rename
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
