import { FC } from "react";
import { CardProps } from "./Card.type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CARD_STYLES } from "@/app/constants/cards";

const Card: FC<CardProps> = ({ value, cardStyle, flipped, selected, hoverable, className, onClick }) => {
  return (
    <div
      className={cn(
        "absolute transition-all duration-500 w-full h-full transform-3d perspective-distant rounded-xl",
        className,
        {
          "cursor-pointer": onClick,
          "hover:-translate-y-1 hover:shadow-xl": hoverable,
          "scale-105 -translate-y-1 border-emerald-500 shadow-xl": selected,
          "rotate-y-180": flipped,
        }
      )}
      onClick={onClick}
    >
      {/* Card front */}
      {value && CARD_STYLES[cardStyle].cards[value] && (
        <Image
          src={CARD_STYLES[cardStyle].cards[value]}
          alt={value}
          fill
          sizes="(max-width: 600px) 64px, 120px"
          className="backface-hidden rounded rotate-y-180"
        />
      )}
      {/* Card back */}
      <Image
        src={CARD_STYLES[cardStyle].back}
        alt="Card Back"
        fill
        sizes="(max-width: 768px) 120px, 64px"
        className="backface-hidden rounded"
      />
    </div>
  );
};

export default Card;
