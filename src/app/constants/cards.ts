import InscryptionXXS from "@/assets/inscryption/card-xxs.jpg";
import InscryptionXS from "@/assets/inscryption/card-xs.jpg";
import InscryptionS from "@/assets/inscryption/card-s.jpg";
import InscryptionM from "@/assets/inscryption/card-m.jpg";
import InscryptionL from "@/assets/inscryption/card-l.jpg";
import InscryptionXL from "@/assets/inscryption/card-xl.jpg";
import InscryptionXXL from "@/assets/inscryption/card-xxl.jpg";
import InscryptionBack from "@/assets/inscryption/card-back.jpg";

import UnoXXS from "@/assets/uno/card-xxs.jpg";
import UnoXS from "@/assets/uno/card-xs.jpg";
import UnoS from "@/assets/uno/card-s.jpg";
import UnoM from "@/assets/uno/card-m.jpg";
import UnoL from "@/assets/uno/card-l.jpg";
import UnoXL from "@/assets/uno/card-xl.jpg";
import UnoXXL from "@/assets/uno/card-xxl.jpg";
import UnoBack from "@/assets/uno/card-back.jpg";

import DefaultXXS from "@/assets/default/card-xxs.png";
import DefaultXS from "@/assets/default/card-xs.png";
import DefaultS from "@/assets/default/card-s.png";
import DefaultM from "@/assets/default/card-m.png";
import DefaultL from "@/assets/default/card-l.png";
import DefaultXL from "@/assets/default/card-xl.png";
import DefaultXXL from "@/assets/default/card-xxl.png";
import DefaultBack from "@/assets/default/card-back.png";

import { StaticImageData } from "next/image";
import { CardEnum } from "../type/card";

export const CARDS = [CardEnum.XXS, CardEnum.XS, CardEnum.S, CardEnum.M, CardEnum.L, CardEnum.XL, CardEnum.XXL];

export const DEFAULT_CARDS: Record<string, StaticImageData> = {
  XXS: DefaultXXS,
  XS: DefaultXS,
  S: DefaultS,
  M: DefaultM,
  L: DefaultL,
  XL: DefaultXL,
  XXL: DefaultXXL,
  concealed: DefaultBack,
};

export const INSCRYPTION_CARDS: Record<string, StaticImageData> = {
  XXS: InscryptionXXS,
  XS: InscryptionXS,
  S: InscryptionS,
  M: InscryptionM,
  L: InscryptionL,
  XL: InscryptionXL,
  XXL: InscryptionXXL,
  concealed: InscryptionBack,
};

export const UNO_CARDS: Record<string, StaticImageData> = {
  XXS: UnoXXS,
  XS: UnoXS,
  S: UnoS,
  M: UnoM,
  L: UnoL,
  XL: UnoXL,
  XXL: UnoXXL,
  concealed: UnoBack,
};

export const CARD_STYLES = {
  default: {
    cards: DEFAULT_CARDS,
    back: DefaultBack,
  },
  inscryption: {
    cards: INSCRYPTION_CARDS,
    back: InscryptionBack,
  },
  uno: {
    cards: UNO_CARDS,
    back: UnoBack,
  },
};
