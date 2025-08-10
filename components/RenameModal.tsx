"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { renameFile } from "@/services/files";
import { useAppStore } from "@/store/store";

const RenameModal = () => {
  const { user } = useUser();
  const [newName, setNewName] = useState("");

  const { isRenameModalOpen, setIsRenameModalOpen, fileId, fileName } =
    useAppStore();

  const handleRename = async () => {
    if (!user || !fileId || !newName.trim()) return;

    const ext = fileName?.split(".").pop();
    const fullNewName = newName + (ext ? `.${ext}` : "");

    await renameFile(user.id, fileId, fullNewName);

    setNewName("");
    setIsRenameModalOpen(false);
  };

  const fileNameWithoutExt = fileName?.split(".").slice(0, -1).join(".");

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
                handleRename();
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
            <Button type="submit" onClick={handleRename}>
              Rename
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
