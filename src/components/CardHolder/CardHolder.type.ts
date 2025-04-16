import { CardProps } from "../Card/Card.type";

export type CardHolderProps = CardProps & {
  nonce?: string;
  isMostFrequent?: boolean;
};
