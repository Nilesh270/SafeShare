"use client";
import { Button } from "@/components/ui/button";

export const Topbar = ({ account, onDisconnect }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="text-sm text-gray-600">
        Wallet: {account || "Not connected"}
      </div>
      {account && (
        <Button variant="destructive" onClick={onDisconnect}>
          Disconnect
        </Button>
      )}
    </div>
  );
};
