import { FC } from "react";
import { CardHolderProps } from "./CardHolder.type";
import Card from "../Card";
import { AnimatePresence, motion } from "motion/react";
import { CardEnum } from "@/app/type/card";

const { SPIKE, SPLIT } = CardEnum;

const CardHolder: FC<CardHolderProps> = ({ nonce, isMostFrequent, isThinking, isConfirmed, ...cardProps }) => {
  const cardShadow =
    cardProps.value === SPIKE || cardProps.value === SPLIT
      ? "0px 2px 20px 5px #fc5656"
      : isMostFrequent
      ? "0px 2px 10px 5px #3ef584"
      : "0px 2px 10px 5px rgba(0, 0, 0, 0)";

  return (
    <div className="relative shrink-0 w-16 h-24 sm:w-24 sm:h-36 md:w-30 md:h-45">
      {/* Card placeholder */}
      <div className="absolute w-full h-full flex items-center justify-center bg-white border-2 border-gray-300 rounded-sm md:rounded-md">
        <AnimatePresence mode="wait">
          {isThinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="w-6 h-6 md:w-8 md:h-8 absolute -right-3 -top-3 z-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/thinking.gif" alt="thinking" className="w-full h-full" />
            </motion.div>
          )}
          {isConfirmed && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeInOut" }}
              className="w-6 h-6 md:w-8 md:h-8 absolute -right-3 -top-3 z-10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/check.png" alt="confirmed" className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {cardProps.value && (
          <motion.div
            key={nonce || cardProps.value}
            initial={{ x: -10, y: -10, boxShadow: "4px 6px 12px 4px rgba(0, 0, 0, 1)", opacity: 0 }}
            animate={{
              x: 0,
              y: 0,
              boxShadow: cardProps.flipped ? cardShadow : "0px 2px 10px 5px rgba(0, 0, 0, 0)",
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
