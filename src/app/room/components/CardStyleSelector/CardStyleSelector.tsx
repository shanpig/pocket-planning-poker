"use client";

import Image from "next/image";
import { CARD_STYLES } from "@/app/constants/cards";
import { cn } from "@/lib/utils";
import { CardStyleSelectorProps } from "./CardStyleSelector.type";
import { useState } from "react";
import { ArrowBigDown } from "lucide-react";

const EXPAND_RATIO = 120;

const CardStyleSelector = ({ cardStyle, setCardStyle }: CardStyleSelectorProps) => {
  const [expanded, setExpanded] = useState(false);

  const onCardClick = (key: keyof typeof CARD_STYLES) => {
    setCardStyle(key);
    setExpanded(false);
  };

  return (
    <div
      className={cn("fixed right-2 bottom-2 w-10 md:w-14 aspect-[2/3]", {
        "hover:scale-105 transition-all": !expanded,
      })}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="absolute w-full h-full z-20 flex justify-center items-center select-none cursor-pointer text-white text-3xl font-bold bg-gray-600/50"
      >
        {expanded ? ">" : "<"}
      </div>
      {Object.entries(CARD_STYLES).map(([key, { back }], index) => (
        <div
          key={key}
          className="absolute w-full h-full transition-all"
          style={{
            marginLeft: `${expanded ? `${-(index * EXPAND_RATIO + EXPAND_RATIO)}%` : "0px"}`,
          }}
        >
          {cardStyle === key && (
            <ArrowBigDown
              className={cn("absolute top-0 left-1/2 -translate-x-1/2 transition-all ", {
                "-top-6 delay-300": expanded,
              })}
            />
          )}
          <Image
            className={cn(
              "absolute w-full h-full rounded-sm shadow-md  shadow-gray-300 cursor-pointer hover:scale-105",
              {
                "z-10": cardStyle === key,
              }
            )}
            width={50}
            height={75}
            key={key}
            src={back}
            alt={key}
            onClick={() => onCardClick(key as keyof typeof CARD_STYLES)}
          />
        </div>
      ))}
    </div>
  );
};

export default CardStyleSelector;
