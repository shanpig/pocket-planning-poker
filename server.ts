import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { EVENTS } from "@/lib/events";
import { Room } from "@/app/type/room";
import { ServerSender } from "@/lib/sender";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({ dev, port, hostname });
const handler = app.getRequestHandler();

const room: Room = {
  id: "1",
  users: {},
  flipped: false,
};

const createUser = (socketId: string, name: string) => {
  if (Object.values(room.users).some((user) => user.name === name)) {
    return {
      ok: false,
      error: "User already exists",
    };
  }

  room.users[socketId] = {
    id: socketId,
    name,
  };

  return {
    ok: true,
  };
};

const getRoom = () => {
  return {
    ...room,
    users: getUsers(),
  };
};

const getUsers = () => {
  return Object.values(room.users).map((user) => ({
    ...user,
    card: room.flipped ? user.card : user.card ? "concealed" : "",
  }));
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");

    const sender = new ServerSender(io, socket);

    sender.on(EVENTS.JOIN, (data) => {
      const result = createUser(socket.id, data.name);

      if (result.ok) {
        sender.sendEvent(EVENTS.JOINED, { name: data.name });
        sender.toAll(EVENTS.ROOM_UPDATED, getRoom());
      } else {
        sender.sendEvent(EVENTS.ERROR, { error: result.error });
      }
    });

    sender.on(EVENTS.DISCONNECT, () => {
      delete room.users[socket.id];
      sender.broadcast(EVENTS.ROOM_UPDATED, getRoom());
    });

    sender.on(EVENTS.GET_ROOM_UPDATE, () => {
      sender.sendEvent(EVENTS.ROOM_UPDATED, getRoom());
    });

    sender.on(EVENTS.SELECT_CARD, (data) => {
      room.users[socket.id].card = data.card;
      sender.toAll(EVENTS.ROOM_UPDATED, getRoom());
    });

    sender.on(EVENTS.FLIP_CARDS, () => {
      room.flipped = true;
      sender.toAll(EVENTS.ROOM_UPDATED, getRoom());
    });

    sender.on(EVENTS.RESTART, () => {
      room.flipped = false;
      Object.values(room.users).forEach((user) => {
        user.card = null;
      });
      sender.toAll(EVENTS.RESTARTED, getRoom());
    });
  });

  io.on("disconnect", (socket) => {
    console.log("a user disconnected");
    delete room.users[socket.id];
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
});
