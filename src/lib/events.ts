export const GENERAL_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
} as const;

export const CLIENT_SENT_EVENTS = {
  JOIN: "join",
  SELECT_CARD: "select_card",
  FLIP_CARDS: "flip_cards",
  RESTART: "restart",
  GET_ROOM_UPDATE: "get_room_update",
} as const;

export const SERVER_SENT_EVENTS = {
  JOINED: "joined",
  ROOM_UPDATED: "room_updated",
  RESTARTED: "restarted",
  ERROR: "room_error",
} as const;

export const CLIENT_RECEIVED_EVENTS = {
  ...SERVER_SENT_EVENTS,
  ...GENERAL_EVENTS,
} as const;

export const SERVER_RECEIVED_EVENTS = {
  ...CLIENT_SENT_EVENTS,
  ...GENERAL_EVENTS,
} as const;
