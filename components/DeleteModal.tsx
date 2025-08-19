import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { deleteFile } from "@/services/files";
import { useAppStore } from "@/store/store";

const DeleteModal = () => {
  const { user } = useUser();

  const { isDeleteModalOpen, setIsDeleteModalOpen, fileId } = useAppStore();

  const handleDelete = async () => {
    if (!user || !fileId) return;

    await deleteFile(user.id, fileId);

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
