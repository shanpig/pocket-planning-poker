import { DefaultEventsMap, Server, Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";

export class ClientSender {
  constructor(private socket: ClientSocket) {
    this.socket = socket;
  }

  sendEvent(eventName: string, data?: any) {
    console.log(`client > ${eventName}`, data);
    this.socket.emit(eventName, data);
  }

  on(eventName: string, callback?: (data: any) => void) {
    this.socket.on(eventName, (data) => {
      console.log(`client < ${eventName}`, data);
      callback?.(data);
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

  toAll(eventName: string, data: any) {
    console.log(`server toAll > ${eventName}`, data);
    this.io.sockets.emit(eventName, data);
  }

  broadcast(eventName: string, data: any) {
    console.log(`server broadcast > ${eventName}`, data);
    this.socket.broadcast.emit(eventName, data);
  }

  sendEvent(eventName: string, data: any) {
    console.log(`server > ${eventName}`, data);
    this.socket.emit(eventName, data);
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    this.socket.on(eventName, (data) => {
      console.log(`server < ${eventName}`, data);
      callback(data);
    });
  }
}
