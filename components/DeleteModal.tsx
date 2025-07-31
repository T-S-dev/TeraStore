import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db, storage } from "@/lib/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { toast } from "sonner";

const DeleteModal = () => {
  const { user } = useUser();

  const { setIsDeleteModalOpen, isDeleteModalOpen, fileId } = useAppStore();

  const deleteFile = async () => {
    if (!user || !fileId) return;

    const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);

    try {
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "users", user.id, "files", fileId));
      toast.success("File deleted successfully!", {
        duration: 1500,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error deleting file!", {
        duration: 1500,
      });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="flex-1 py-6 "
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            className="flex-1 py-6"
            onClick={deleteFile}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
