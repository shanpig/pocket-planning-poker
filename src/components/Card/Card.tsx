import { FC } from "react";
import { CardProps } from "./Card.type";
import { cn } from "@/lib/utils";
import CardBack from "@/assets/card-back.svg";

const Card: FC<CardProps> = ({ value, flipped, selected, hoverable, onClick }) => {
  return (
    <div
      className={cn(
        "relative w-10 h-15 shrink-0 sm:w-16 sm:h-24 md:w-24 md:h-36 perspective-1000 transition-all duration-150",
        {
          "cursor-pointer": onClick,
          "hover:-translate-y-1 hover:shadow-xl": hoverable,
          "scale-105 -translate-y-1 border-emerald-500 shadow-xl": selected,
        }
      )}
      onClick={onClick}
    >
      {/* Card placeholder */}
      <div className="absolute w-full h-full flex items-center justify-center bg-white border-2 border-gray-300 rounded-sm md:rounded-md"></div>

      {value && (
        <div
          className={cn("absolute w-full h-full transition-transform duration-500 transform-3d", {
            "rotate-y-180": flipped,
          })}
        >
          <>
            {/* Card front */}
            <div className="absolute w-full h-full flex backface-hidden rotate-y-180 items-center justify-center bg-emerald-200 border-4 border-emerald-400 rounded-sm md:rounded-md text-xs sm:text-base md:text-lg lg:text-xl transition-colors duration-150">
              <div>{value}</div>
            </div>
            {/* Card back */}
            <div className="absolute w-full h-full backface-hidden  flex items-center justify-center bg-emerald-200 border-4 border-emerald-400 rounded-sm md:rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={CardBack.src}
                alt="Card Back"
                className="p-2 w-full h-full object-cover rounded-sm md:rounded-md"
              />
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default Card;
