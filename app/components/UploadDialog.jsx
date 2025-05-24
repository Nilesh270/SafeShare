"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const UploadDialog = ({ onUpload }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload a File</DialogTitle>{" "}
        {/* ✅ Added title for accessibility */}
        <input type="file" onChange={onUpload} />
      </DialogContent>
    </Dialog>
  );
};
