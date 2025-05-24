"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ShareDialog({ open, onClose, onShare, cid }) {
  const [recipient, setRecipient] = useState("");

  const handleSubmit = async () => {
    await onShare(cid, recipient);
    setRecipient("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter recipient wallet address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Share</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
