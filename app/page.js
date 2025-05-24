"use client";
import { useState, useEffect } from "react";
import { useWallet } from "./hooks/useWallet";
import { useDriveContract } from "./hooks/useDriveContract";
import { uploadFileToIPFS } from "./lib/pinata";

import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { FileList } from "./components/FileList";
import { UploadDialog } from "./components/UploadDialog";
import ShareDialog from "./components/ShareDialog";
import TransferDialog from "./components/TransferDialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { account, signer, disconnectWallet } = useWallet();
  const contract = useDriveContract(signer);

  const [tab, setTab] = useState("My Files");
  const [myFiles, setMyFiles] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedCid, setSelectedCid] = useState(null);

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedTransferCid, setSelectedTransferCid] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!contract || !account) return;
      setMyFiles(await contract.getMyFiles());
      setSharedFiles(await contract.getSharedFiles());
    };
    load();
  }, [contract, account]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !contract) return;
    setUploading(true);
    try {
      const { cid, fileName } = await uploadFileToIPFS(file);
      const tx = await contract.uploadFile(cid, fileName);
      await tx.wait();

      setMyFiles((prev) => [...prev, { cid, fileName }]);
      toast.success("File uploaded successfully!");
      router.push("/");
    } catch (err) {
      console.error(err);
      // alert("Upload failed");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openShareDialog = (cid) => {
    setSelectedCid(cid);
    setIsShareDialogOpen(true);
  };

  const handleConfirmShare = async (cid, recipient) => {
    if (!recipient || !contract) return;
    try {
      const tx = await contract.shareFile(cid, recipient);
      await tx.wait();
      // alert("File shared!");
      toast.success("File shared!");
    } catch (err) {
      console.error(err);
      // alert("Failed to share file");
      toast.error("Failed to share file");
    }
  };

  const openTransferDialog = (cid) => {
    setSelectedTransferCid(cid);
    setIsTransferDialogOpen(true);
  };

  const handleConfirmTransfer = async (cid, newOwner) => {
    if (!newOwner || !contract) return;
    try {
      const tx = await contract.transferOwnership(cid, newOwner);
      await tx.wait();
      toast.success("Ownership transferred!");
      // alert("Ownership transferred!");
      setMyFiles(await contract.getMyFiles()); // refresh
    } catch (err) {
      console.error(err);
      toast.error("Failed to transfer ownership");
      // alert("Failed to transfer ownership");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setTab} />
      <div className="flex-1 flex flex-col">
        <Topbar account={account} onDisconnect={disconnectWallet} />
        <div className="p-6">
          {tab === "My Files" && (
            <FileList
              files={myFiles}
              onShare={openShareDialog}
              onTransfer={openTransferDialog}
              trans={true}
            />
          )}
          {tab === "Shared With Me" && (
            <FileList
              files={sharedFiles}
              onShare={() => {}}
              onTransfer={() => {}}
              trans={false}
            />
          )}
          {tab === "Upload" && <UploadDialog onUpload={handleUpload} />}
          {tab === "Settings" && (
            <p className="text-gray-500">🔧 Coming Soon</p>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        onShare={handleConfirmShare}
        cid={selectedCid}
      />

      {/*  Transfer Dialog */}
      <TransferDialog
        open={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        onTransfer={handleConfirmTransfer}
        cid={selectedTransferCid}
      />
    </div>
  );
}
