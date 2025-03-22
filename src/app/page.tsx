"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const HomePage: React.FC = () => {
  const router = useRouter();

  const createRoom = () => {
    const roomId = uuid().slice(0, 8);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`).then(() => {
        toast("Room URL copied to clipboard");
        setTimeout(() => router.push(`/room/${roomId}`), 1500);
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Welcome to Planning Poker</h1>
      <button onClick={createRoom} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
        Create or Join a Room
      </button>
      <Toaster />
    </div>
  );
};

export default HomePage;
