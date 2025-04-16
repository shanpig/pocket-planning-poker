"use client";

import { CARD_STYLES, CARDS } from "@/app/constants/cards";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import { useState } from "react";

import useRoom from "./hooks/useRoom";
import MembersTable from "@/components/MembersTable";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { countBy, last, maxBy } from "lodash-es";

export default function RoomPage() {
  const [input, setInput] = useState("");
  const [cardStyle, setCardStyle] = useState<keyof typeof CARD_STYLES>("default");

  const { name, room, socket, selectedCard, joinWithName, selectCard, flipCards, restart } = useRoom();

  const appearedTimes = countBy(Object.values(room.users).map(({ card }) => card?.value));
  const mostFrequentlyChoosedEntry = maxBy(Object.entries(appearedTimes), last) || ["", 0];
  const mostFrequentlyChoosed =
    room.flipped && mostFrequentlyChoosedEntry[1] > 1 ? mostFrequentlyChoosedEntry[0] : undefined;

  return (
    <main className="flex flex-col items-center gap-4 p-6 h-screen">
      {name ? (
        <div className="flex flex-col justify-center gap-8 pt-4 pb-24 sm:pb-36 w-full">
          <div className="flex flex-col gap-2 md:items-center border-2 border-gray-300 rounded-md p-4 w-full lg:mb-8">
            <div className="sm:text-lg lg:text-2xl text-center">Members in the room</div>
            <MembersTable
              room={room}
              socketId={socket.id}
              cardStyle={cardStyle}
              mostFrequentlyChoosed={mostFrequentlyChoosed}
            />
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {CARDS.map((value) => (
              <div key={value} className="relative shrink-0 w-16 h-24 sm:w-24 sm:h-36 md:w-30 md:h-45">
                <Card
                  value={value}
                  flipped
                  hoverable
                  cardStyle={cardStyle}
                  selected={selectedCard === value}
                  onClick={() => selectCard(value)}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
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

          <div className="fixed left-0 right-0 bottom-0 pb-4 bg-linear-to-b from-transparent from-15%  to-gray-400 flex gap-4 justify-center">
            {Object.entries(CARD_STYLES).map(([key, { back }]) => (
              <Image
                className={cn(
                  "w-10 md:w-14 aspect-[2/3] rounded-sm shadow-md transition-all shadow-gray-300 cursor-pointer hover:scale-105",
                  {
                    "-translate-y-3 shadow-lg ": cardStyle === key,
                  }
                )}
                width={50}
                height={75}
                key={key}
                src={back}
                alt={key}
                onClick={() => setCardStyle(key as keyof typeof CARD_STYLES)}
              />
            ))}
          </div>
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
