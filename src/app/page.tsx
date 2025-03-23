"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { socket } from "@/lib/socket";
import { ClientSender } from "@/lib/sender/sender";
import { CLIENT_RECEIVED_EVENTS, CLIENT_SENT_EVENTS } from "@/lib/events";
import { Button } from "@/components/ui/button";

const sender = new ClientSender(socket);

const HomePage: React.FC = () => {
  const [roomCreating, setRoomCreating] = useState(false);
  const router = useRouter();

  const createRoom = () => {
    if (roomCreating) return;
    const roomId = uuid().slice(0, 8);
    sender.sendEvent({ type: CLIENT_SENT_EVENTS.CREATE_ROOM, data: { roomId } });
    setRoomCreating(true);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`).then(() => {
        toast("Room URL copied to clipboard");
      });
    }
  };

  useEffect(() => {
    sender.on({
      type: CLIENT_RECEIVED_EVENTS.ROOM_CREATED,
      handler: (data) => {
        setTimeout(() => router.push(`/room/${data.roomId}`), 1000);
      },
    });
  }, [router]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen p-2">
      <h1 className="text-4xl font-bold text-center">Welcome to Planning Poker</h1>
      <Button onClick={createRoom} disabled={roomCreating}>
        {roomCreating ? "Creating..." : "Create a Room"}
      </Button>
      <Toaster />
    </div>
  );
};

export default HomePage;
