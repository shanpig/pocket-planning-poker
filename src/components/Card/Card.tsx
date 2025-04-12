import { FC } from "react";
import { CardProps } from "./Card.type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CARD_STYLES } from "@/app/constants/cards";

const Card: FC<CardProps> = ({ value, cardStyle, flipped, selected, hoverable, onClick }) => {
  return (
    <div
      className={cn(
        "relative w-16 h-24 shrink-0 sm:w-24 sm:h-36 md:w-30 md:h-45 perspective-1000 transition-all duration-150",
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
            <div className="absolute w-full h-full flex backface-hidden rotate-y-180 items-center justify-center  rounded-sm md:rounded-md text-xs sm:text-base md:text-lg lg:text-xl transition-colors duration-150">
              {CARD_STYLES[cardStyle].cards[value] && (
                <Image src={CARD_STYLES[cardStyle].cards[value]} alt={value} fill />
              )}
            </div>
            {/* Card back */}
            <div className="absolute w-full h-full backface-hidden  flex items-center justify-center rounded-sm md:rounded-md">
              <Image src={CARD_STYLES[cardStyle].back} alt="Card Back" fill />
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default Card;
