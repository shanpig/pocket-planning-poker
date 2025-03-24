"use client";

import { CARDS } from "@/app/constants/cards";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import { useState } from "react";

import useRoom from "./hooks/useRoom";
import MembersTable from "@/components/MembersTable";

export default function RoomPage() {
  const [input, setInput] = useState("");

  const { name, room, socket, selectedCard, joinWithName, selectCard, flipCards, restart } = useRoom();

  return (
    <main className="flex flex-col items-center gap-4 p-6 h-screen">
      {name ? (
        <div className="flex flex-col justify-center gap-4 py-4 w-full">
          <div className="flex flex-col gap-2 md:items-center border-2 border-gray-300 rounded-md p-4 w-full lg:mb-8">
            <div className="sm:text-lg lg:text-2xl mb-4 text-center">Members in the room</div>
            <MembersTable room={room} socketId={socket.id} selectedCard={selectedCard} />
          </div>

          <div className="flex gap-x-2 gap-y-4 justify-center md:gap-4 flex-wrap">
            {CARDS.map((card) => (
              <Card
                value={card}
                key={card}
                flipped
                hoverable
                selected={selectedCard === card}
                onClick={() => selectCard(card)}
              />
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
        <form className="h-screen flex flex-col gap-4 justify-center items-center" onSubmit={(e) => e.preventDefault()}>
          <div className="text-2xl">What is your name?</div>
          <input
            type="text"
            autoFocus
            className="border-2 border-gray-300 rounded-md p-2"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="w-full" onClick={() => joinWithName(input)}>
            Join
          </Button>
        </form>
      )}
      <Toaster position="top-center" />
    </main>
  );
}
