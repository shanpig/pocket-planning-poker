import { FC } from "react";
import { CardHolderProps } from "./CardHolder.type";
import Card from "../Card";
import { AnimatePresence, motion } from "motion/react";
import { CardEnum } from "@/app/type/card";

const { SPIKE, SPLIT } = CardEnum;

const CardHolder: FC<CardHolderProps> = ({ nonce, isMostFrequent, ...cardProps }) => {
  const cardShadow =
    cardProps.value === SPIKE || cardProps.value === SPLIT
      ? "0px 2px 20px 5px #fc5656"
      : isMostFrequent
      ? "0px 2px 10px 5px #3ef584"
      : "0px 2px 10px 5px rgba(0, 0, 0, 0)";

  return (
    <div className="relative shrink-0 w-16 h-24 sm:w-24 sm:h-36 md:w-30 md:h-45">
      {/* Card placeholder */}
      <div className="absolute w-full h-full flex items-center justify-center bg-white border-2 border-gray-300 rounded-sm md:rounded-md"></div>

      <AnimatePresence mode="wait">
        {cardProps.value && (
          <motion.div
            key={nonce || cardProps.value}
            initial={{ x: -10, y: -10, boxShadow: "4px 6px 12px 4px rgba(0, 0, 0, 1)", opacity: 0 }}
            animate={{
              x: 0,
              y: 0,
              boxShadow: cardShadow,
              opacity: 1,
            }}
            exit={{ x: 15, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute w-full h-full rounded-xl"
          >
            <Card {...cardProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardHolder;
