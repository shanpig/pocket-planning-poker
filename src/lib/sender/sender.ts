import { DefaultEventsMap, Server, Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";
import { ClientEventHandler, ClientEventPayload, ServerEventHandler, ServerEventPayload } from "./sender.type";

export class ClientSender {
  constructor(private socket: ClientSocket) {
    this.socket = socket;
  }

  sendEvent(payload: ClientEventPayload) {
    console.log(`client > ${payload.type}`, payload.data);
    this.socket.emit(payload.type, payload.data);
  }

  on(args: ClientEventHandler) {
    this.socket.on(args.type, (data: any) => {
      console.log(`client < ${args.type}`, data);
      args.handler?.(data);
    });
  }
}

export class ServerSender {
  constructor(
    private io: Server,
    private socket: ServerSocket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) {
    this.io = io;
    this.socket = socket;
  }

  toAll(payload: ServerEventPayload, roomId: string) {
    console.log(`server toAll > ${payload.type}`, payload.data);
    this.io.to(roomId).emit(payload.type, payload.data);
  }

  sendEvent(payload: ServerEventPayload) {
    console.log(`server > ${payload.type}`, payload.data);
    this.socket.emit(payload.type, payload.data);
  }

  on(args: ServerEventHandler) {
    this.socket.on(args.type, (data: any) => {
      console.log(`server < ${args.type}`, data);
      args.handler?.(data);
    });
  }
}
