import Image from "next/image";
import { CARD_STYLES } from "@/app/constants/cards";
import { cn } from "@/lib/utils";
import { CardStyleSelectorProps } from "./CardStyleSelector.type";

const CardStyleSelector = ({ cardStyle, setCardStyle }: CardStyleSelectorProps) => {
  return (
    <div className="fixed left-0 right-0 bottom-0 pb-4 bg-linear-to-b from-transparent from-15% to-gray-400 flex gap-4 justify-center">
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
  );
};

export default CardStyleSelector;
