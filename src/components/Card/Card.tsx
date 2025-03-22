import { FC } from "react";
import { CardProps } from "./Card.type";
import { cn } from "@/lib/utils";

const Card: FC<CardProps> = ({ value, flipped, hoverable, onClick }) => {
  return (
    <div
      className={cn("relative w-32 h-48 perspective-1000 transition-all duration-300", {
        "hover:-translate-y-1 hover:shadow-xl": hoverable,
        "cursor-pointer": onClick,
      })}
      onClick={onClick}
    >
      <div
        className={cn("absolute w-full h-full transition-transform duration-500 transform-3d", {
          "rotate-y-180": flipped,
        })}
      >
        <div className="absolute w-full h-full flex backface-hidden rotate-y-180 items-center justify-center bg-white border-2 border-gray-300 rounded-md">
          <div>{value}</div>
        </div>
        <div className="absolute w-full h-full backface-hidden  flex items-center justify-center bg-gray-200 border-2 border-gray-300 rounded-md">
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="https://picsum.photos/seed/poker/200/300"
              alt="Card Back"
              className="w-full h-full object-cover rounded-md"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
