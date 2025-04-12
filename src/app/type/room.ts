import { CardValue } from "./card";

export type Rooms = Record<string, Room>;

export type Room = {
  id: string;
  users: Users;
  flipped: boolean;
};

export type User = {
  id: string;
  name: string;
  card?: CardValue;
};

export type Users = Record<string, User>;
