import { CARD_STYLES } from "@/app/constants/cards";

export type CardStyleSelectorProps = {
  cardStyle: keyof typeof CARD_STYLES;
  setCardStyle: (cardStyle: keyof typeof CARD_STYLES) => void;
};
