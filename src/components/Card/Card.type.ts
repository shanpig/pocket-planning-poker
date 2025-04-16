import { CARD_STYLES } from "@/app/constants/cards";
import { CardValue } from "@/app/type/card";

export interface CardProps {
  value?: CardValue | null;
  flipped?: boolean;
  selected?: boolean;
  hoverable?: boolean;
  cardStyle: keyof typeof CARD_STYLES;
  className?: string;
  onClick?: () => void;
}
