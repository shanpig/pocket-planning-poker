"use client";

import { CARDS } from "@/app/constants/cards";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { socket } from "@/lib/socket";
import { useState } from "react";

import useRoom from "./hooks/useRoom";
import MembersTable from "@/components/MembersTable";

export default function RoomPage() {
  const [input, setInput] = useState("");

  const { name, room, selectedCard, joinWithName, selectCard, flipCards, restart } = useRoom();

  return (
    <main className="flex flex-col items-center gap-4 p-6">
      {name ? (
        <div className="flex flex-col gap-2">
          <div>hello, {name}</div>

          <div className="flex flex-col gap-2 border-2 border-gray-300 rounded-md p-4 w-full">
            <div>Members in the room</div>
            <MembersTable room={room} socketId={socket.id} selectedCard={selectedCard} />
          </div>

          <div className="flex gap-2">
            {CARDS.map((card) => (
              <Card value={card} key={card} flipped hoverable onClick={() => selectCard(card)} />
            ))}
          </div>

          <Button
            disabled={room?.flipped || Object.values(room?.users ?? {}).some(({ card }) => !card)}
            onClick={() => flipCards()}
          >
            Flip Cards
          </Button>
          <Button disabled={!room?.flipped} onClick={() => restart()}>
            Restart
          </Button>
        </div>
      ) : (
        <>
          <div className="text-2xl">What is your name?</div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className="border-2 border-gray-300 rounded-md p-2"
              onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => joinWithName(input)}>Join</Button>
          </div>
        </>
      )}
      <Toaster position="top-center" />
    </main>
  );
}
