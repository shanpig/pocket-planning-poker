import { CardValue } from "./card";

export type Rooms = Record<string, Room>;

export type Room = {
  id: string;
  users: Users;
  flipped: boolean;
  flippedTimes: number;
};

export type User = {
  id: string;
  name: string;
  isThinking: boolean;
  isConfirmed: boolean;
  card?: {
    value: CardValue;
    nonce: string;
  } | null;
};

export type Users = Record<string, User>;
