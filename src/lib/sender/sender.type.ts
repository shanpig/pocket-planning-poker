import { Room } from "@/app/type/room";
import { CLIENT_RECEIVED_EVENTS, CLIENT_SENT_EVENTS, SERVER_RECEIVED_EVENTS, SERVER_SENT_EVENTS } from "../events";

export type ClientEventPayload =
  | { type: typeof CLIENT_SENT_EVENTS.JOIN; data: { name: string; roomId: string } }
  | { type: typeof CLIENT_SENT_EVENTS.SELECT_CARD; data: { card: string; roomId: string } }
  | { type: typeof CLIENT_SENT_EVENTS.FLIP_CARDS; data: { roomId: string } }
  | { type: typeof CLIENT_SENT_EVENTS.RESTART; data: { roomId: string } }
  | { type: typeof CLIENT_SENT_EVENTS.GET_ROOM_UPDATE; data: { roomId: string } }
  | { type: typeof CLIENT_SENT_EVENTS.CHECK_ROOM; data: { roomId: string } }
  | { type: typeof CLIENT_SENT_EVENTS.CREATE_ROOM; data: { roomId: string } };

export type ClientEventHandler =
  | { type: typeof CLIENT_RECEIVED_EVENTS.JOINED; handler: (data: { name: string }) => void }
  | { type: typeof CLIENT_RECEIVED_EVENTS.ROOM_UPDATED; handler: (data: { room: Room }) => void }
  | { type: typeof CLIENT_RECEIVED_EVENTS.RESTARTED; handler: (data: { room: Room }) => void }
  | { type: typeof CLIENT_RECEIVED_EVENTS.ERROR; handler: (data: { error: string }) => void }
  | { type: typeof CLIENT_RECEIVED_EVENTS.CONNECT; handler?: () => void }
  | { type: typeof CLIENT_RECEIVED_EVENTS.DISCONNECT; handler?: () => void }
  | { type: typeof CLIENT_RECEIVED_EVENTS.ROOM_EXISTS; handler: (data: { exists: boolean }) => void }
  | { type: typeof CLIENT_RECEIVED_EVENTS.ROOM_CREATED; handler: (data: { roomId: string }) => void };

export type ServerEventPayload =
  | { type: typeof SERVER_SENT_EVENTS.JOINED; data: { name: string } }
  | { type: typeof SERVER_SENT_EVENTS.ROOM_UPDATED; data: { room: Room } }
  | { type: typeof SERVER_SENT_EVENTS.RESTARTED; data: { room: Room } }
  | { type: typeof SERVER_SENT_EVENTS.ERROR; data: { error: string } }
  | { type: typeof SERVER_SENT_EVENTS.ROOM_EXISTS; data: { exists: boolean } }
  | { type: typeof SERVER_SENT_EVENTS.ROOM_CREATED; data: { roomId: string } };

export type ServerEventHandler =
  | { type: typeof SERVER_RECEIVED_EVENTS.JOIN; handler: (data: { name: string; roomId: string }) => void }
  | { type: typeof SERVER_RECEIVED_EVENTS.SELECT_CARD; handler: (data: { card: string; roomId: string }) => void }
  | { type: typeof SERVER_RECEIVED_EVENTS.FLIP_CARDS; handler: (data: { roomId: string }) => void }
  | { type: typeof SERVER_RECEIVED_EVENTS.RESTART; handler: (data: { roomId: string }) => void }
  | { type: typeof SERVER_RECEIVED_EVENTS.GET_ROOM_UPDATE; handler: (data: { roomId: string }) => void }
  | { type: typeof SERVER_RECEIVED_EVENTS.DISCONNECT; handler: () => void }
  | { type: typeof SERVER_RECEIVED_EVENTS.CHECK_ROOM; handler: (data: { roomId: string }) => void }
  | { type: typeof SERVER_RECEIVED_EVENTS.CREATE_ROOM; handler: (data: { roomId: string }) => void };
