import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { tryCatch } from "@/lib/tryCatch";
import { deleteFile } from "@/services/deleteFile";
import { useAppStore } from "@/store/store";

const DeleteModal = () => {
  const { user } = useUser();

  const { isDeleteModalOpen, setIsDeleteModalOpen, fileId } = useAppStore();

  const handleDelete = async () => {
    if (!user || !fileId) return;

    const toastId = toast.loading("Deleting file...");

    const [, deleteError] = await tryCatch(deleteFile(user.id, fileId));

    if (deleteError) {
      console.error("Error deleting file:", deleteError);
      toast.error("Error deleting file!", { id: toastId });
      return;
    }

    toast.success("File deleted successfully!", { id: toastId });
    setIsDeleteModalOpen(false);
  };

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex-1 py-6" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="destructive" className="flex-1 py-6" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
