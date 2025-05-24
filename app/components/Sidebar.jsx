"use client";
import { Button } from "@/components/ui/button";

export const Sidebar = ({ onSelect }) => {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4 border-r space-y-4">
      <h2 className="text-xl font-bold mb-4">🔒 SafeShare</h2>
      {["My Files", "Shared With Me", "Upload", "Settings"].map((label) => (
        <Button
          key={label}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onSelect(label)}
        >
          {label}
        </Button>
      ))}
    </aside>
  );
};
