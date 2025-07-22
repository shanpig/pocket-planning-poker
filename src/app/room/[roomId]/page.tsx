"use client";

import { CARD_STYLES, CARDS } from "@/app/constants/cards";
import Card from "@/components/Card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import { useState } from "react";

import useRoom from "./hooks/useRoom";
import MembersTable from "@/components/MembersTable";
import { countBy, last, maxBy } from "lodash-es";
import { AnimatePresence, motion } from "motion/react";
import CardStyleSelector from "../components/CardStyleSelector";

export default function RoomPage() {
  const [input, setInput] = useState("");
  const [cardStyle, setCardStyle] = useState<keyof typeof CARD_STYLES>("default");

  const {
    name,
    room,
    socket,
    selectedCard,
    isThinking,
    isConfirmed,
    joinWithName,
    selectCard,
    flipCards,
    restart,
    thinking,
    confirm,
  } = useRoom();

  const appearedTimes = countBy(Object.values(room.users).map(({ card }) => card?.value));
  const mostFrequentlyChoosedEntry = maxBy(Object.entries(appearedTimes), last) || ["", 0];
  const mostFrequentlyChoosed =
    room.flipped && mostFrequentlyChoosedEntry[1] > 1 ? mostFrequentlyChoosedEntry[0] : undefined;

  return (
    <main className="relative p-6 pt-9 md:pt-12 min-h-screen">
      <AnimatePresence>
        {room.flippedTimes > 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            <a
              className="absolute top-3 md:top-4 text-sm lg:text-lg font-bold transition-all px-2 py-1 rounded-md hover:scale-105 hover:bg-[#a5f4d0] "
              target="_blank"
              rel="noreferrer noopener"
              href="https://buymeacoffee.com/shanpig"
            >
              ☕ Having fun so far? Buy me a coffee!
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      {name ? (
        <div className="flex flex-col lg:flex-row justify-center gap-8 pt-4 pb-8 sm:pb-10 w-full h-full">
          {/* Members In The Room */}
          <div className="flex flex-col gap-2 md:items-center border-2 border-gray-300 rounded-md p-4 w-full">
            <div className="sm:text-lg lg:text-2xl text-center">Members in the room</div>
            <MembersTable
              room={room}
              socketId={socket.id}
              cardStyle={cardStyle}
              mySelectedCard={selectedCard}
              mostFrequentlyChoosed={mostFrequentlyChoosed}
            />
          </div>

          <div className="flex flex-col gap-8 ">
            {/* Your Cards */}
            <div className="flex gap-4 justify-center flex-wrap">
              {CARDS.map((value) => (
                <div key={value} className="relative shrink-0 w-16 h-24 md:w-20 md:h-30 lg:w-24 lg:h-36">
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

            {/* Buttons */}
            <div className="flex flex-col gap-2 md:gap-4">
              <div className="flex gap-2 md:gap-4">
                <Button
                  variant="outline"
                  className="grow h-10 md:h-16 flex-1/2 md:text-xl"
                  disabled={room.flipped || isThinking}
                  onClick={() => thinking()}
                >
                  Thinking <code>T</code>
                </Button>
                <Button
                  className="grow h-10 md:h-16 flex-1/2 md:text-xl"
                  disabled={!selectedCard || room.flipped || isConfirmed}
                  onClick={() => confirm()}
                >
                  Confirm <code>C</code>/<code>Enter</code>
                </Button>
              </div>
              <Button
                disabled={room?.flipped || isThinking || Object.values(room?.users ?? {}).some(({ card }) => !card)}
                className="h-10 md:h-16 md:text-xl"
                onClick={() => flipCards()}
              >
                Flip Cards <code>F</code>
              </Button>
              <Button disabled={!room?.flipped} onClick={() => restart()} className="h-10 md:h-16 md:text-xl">
                Restart <code>R</code>
              </Button>
            </div>

            {/* Card Styles */}
            <CardStyleSelector cardStyle={cardStyle} setCardStyle={setCardStyle} />
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
          <Button className="w-full max-w-48" onClick={() => joinWithName(input)}>
            Join
          </Button>
        </form>
      )}
      <Toaster position="top-center" />
    </main>
  );
}
