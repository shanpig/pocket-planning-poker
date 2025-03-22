export type Room = {
  id: string;
  users: Users;
  flipped: boolean;
};

export type User = {
  id: string;
  name: string;
  card?: string | null;
};

export type Users = Record<string, User>;
