import { FC } from "react";
import { CardProps } from "./Card.type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CARD_STYLES } from "@/app/constants/cards";

const Card: FC<CardProps> = ({ value, cardStyle, flipped, selected, hoverable, className, onClick }) => {
  return (
    <div
      className={cn("transition-all duration-500 w-full h-full transform-3d perspective-distant", className, {
        "cursor-pointer": onClick,
        "hover:-translate-y-1 hover:shadow-xl": hoverable,
        "scale-105 -translate-y-1 border-emerald-500 shadow-xl": selected,
        "rotate-y-180": flipped,
      })}
      onClick={onClick}
    >
      {/* Card front */}
      <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center rounded">
        {value && CARD_STYLES[cardStyle].cards[value] && (
          <Image src={CARD_STYLES[cardStyle].cards[value]} alt={value} fill sizes="(max-width: 600px) 64px, 120px" />
        )}
      </div>
      {/* Card back */}
      <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded">
        <Image src={CARD_STYLES[cardStyle].back} alt="Card Back" fill sizes="(max-width: 768px) 120px, 64px" />
      </div>
    </div>
  );
};

export default Card;
