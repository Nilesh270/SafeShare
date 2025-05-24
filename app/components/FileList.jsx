"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";

import { useWallet } from "../hooks/useWallet";
import { useDriveContract } from "../hooks/useDriveContract";

export const FileList = ({ files, onShare, onTransfer, trans }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [fileName, setFileName] = useState("");

  const { account, signer, disconnectWallet } = useWallet();
  const contract = useDriveContract(signer);

  const getOwnershipHistory = async (cid) => {
    if (!window.ethereum) return alert("MetaMask not detected");

    try {
      const history = await contract.getOwnershipHistory(cid);
      return history;
    } catch (err) {
      console.error("Error fetching ownership history:", err);
      return [];
    }
  };
  const handleViewOwnership = async (cid, fileName) => {
    const data = await getOwnershipHistory(cid);
    setHistory(data);
    setFileName(fileName);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
        {files.map((file, i) => (
          <Card key={i} className="p-4 flex flex-col gap-2 relative">
            {/* Dropdown menu in top-right corner */}
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleViewOwnership(file.cid, file.fileName)}
                  >
                    View Ownership History
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* File link */}
            <a
              href={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {file.fileName}
            </a>

            <div className="w-full h-full overflow-hidden">
              <iframe
                src={`https://gateway.pinata.cloud/ipfs/${file.cid}`}
                className="w-full h-[20vh] border rounded"
              />
            </div>

            {/* Share & Transfer Buttons */}
            <div className="flex gap-2 justify-end">
              <Button size="sm" onClick={() => onShare(file.cid)}>
                Share
              </Button>

              {trans && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onTransfer(file.cid)}
                >
                  Transfer
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog Box for Ownership History */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ownership History - {fileName}</DialogTitle>
          </DialogHeader>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No ownership history available.
            </p>
          ) : (
            <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto text-sm">
              {history.map((address, idx) => (
                <li
                  key={idx}
                  className="bg-muted px-3 py-1 rounded font-mono text-xs"
                >
                  #{idx + 1} — {address}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
