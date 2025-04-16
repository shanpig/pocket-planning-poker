import InscryptionXXS from "@/assets/inscryption/card-xxs.jpg";
import InscryptionXS from "@/assets/inscryption/card-xs.jpg";
import InscryptionS from "@/assets/inscryption/card-s.jpg";
import InscryptionM from "@/assets/inscryption/card-m.jpg";
import InscryptionL from "@/assets/inscryption/card-l.jpg";
import InscryptionXL from "@/assets/inscryption/card-xl.jpg";
import InscryptionXXL from "@/assets/inscryption/card-xxl.jpg";
import InscryptionSPIKE from "@/assets/inscryption/card-spike.jpg";
import InscryptionSPLIT from "@/assets/inscryption/card-split.jpg";
import InscryptionBack from "@/assets/inscryption/card-back.jpg";

import UnoXXS from "@/assets/uno/card-xxs.png";
import UnoXS from "@/assets/uno/card-xs.png";
import UnoS from "@/assets/uno/card-s.png";
import UnoM from "@/assets/uno/card-m.png";
import UnoL from "@/assets/uno/card-l.png";
import UnoXL from "@/assets/uno/card-xl.png";
import UnoXXL from "@/assets/uno/card-xxl.png";
import UnoSPIKE from "@/assets/uno/card-spike.png";
import UnoSPLIT from "@/assets/uno/card-split.png";
import UnoBack from "@/assets/uno/card-back.png";

import DefaultXXS from "@/assets/default/card-xxs.png";
import DefaultXS from "@/assets/default/card-xs.png";
import DefaultS from "@/assets/default/card-s.png";
import DefaultM from "@/assets/default/card-m.png";
import DefaultL from "@/assets/default/card-l.png";
import DefaultXL from "@/assets/default/card-xl.png";
import DefaultXXL from "@/assets/default/card-xxl.png";
import DefaultSPIKE from "@/assets/default/card-spike.png";
import DefaultSPLIT from "@/assets/default/card-split.png";
import DefaultBack from "@/assets/default/card-back.png";

import { StaticImageData } from "next/image";
import { CardEnum } from "../type/card";

export const CARDS = Object.values(CardEnum).filter((card) => card !== CardEnum.CONCEALED);

export const DEFAULT_CARDS: Record<string, StaticImageData> = {
  XXS: DefaultXXS,
  XS: DefaultXS,
  S: DefaultS,
  M: DefaultM,
  L: DefaultL,
  XL: DefaultXL,
  XXL: DefaultXXL,
  SPIKE: DefaultSPIKE,
  SPLIT: DefaultSPLIT,
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
  SPIKE: InscryptionSPIKE,
  SPLIT: InscryptionSPLIT,
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
  SPIKE: UnoSPIKE,
  SPLIT: UnoSPLIT,
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
