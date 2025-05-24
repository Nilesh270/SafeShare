"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TransferDialog({ open, onClose, onTransfer, cid }) {
  const [address, setAddress] = useState("");

  const handleTransfer = () => {
    if (!address) return alert("Please enter a valid address");
    onTransfer(cid, address);
    setAddress("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Transfer Ownership</DialogTitle>
        <Input
          placeholder="Enter new owner's address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <DialogFooter className="mt-4">
          <Button onClick={handleTransfer}>Transfer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
