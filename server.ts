import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { SERVER_SENT_EVENTS, SERVER_RECEIVED_EVENTS } from "./src/lib/events";
import { Room, Rooms } from "./src/app/type/room";
import { ServerSender } from "./src/lib/sender/sender";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({ dev, port, hostname });
const handler = app.getRequestHandler();

const rooms: Rooms = {};

const createRoom = (roomId: string) => {
  rooms[roomId] = {
    id: roomId,
    users: {},
    flipped: false,
  };
};

const createUser = (socketId: string, name: string, roomId: string) => {
  if (Object.values(rooms[roomId].users).some((user) => user.name === name)) {
    return {
      ok: false,
      error: "User already exists",
    };
  }

  rooms[roomId].users[socketId] = {
    id: socketId,
    name,
  };

  return {
    ok: true,
  };
};

const getRoom = (roomId: string): Room => {
  return {
    ...rooms[roomId],
    users: getUsers(roomId),
  };
};

const getUsers = (roomId: string) => {
  return Object.fromEntries(
    Object.entries(rooms[roomId].users).map(([id, user]) => [
      id,
      {
        ...user,
        card: rooms[roomId].flipped ? user.card : user.card ? "concealed" : "",
      },
    ])
  );
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");

    const sender = new ServerSender(io, socket);

    sender.on({
      type: SERVER_RECEIVED_EVENTS.JOIN,
      handler: (data) => {
        if (!rooms[data.roomId]) {
          createRoom(data.roomId);
        }
        socket.join(data.roomId);
        const result = createUser(socket.id, data.name, data.roomId);

        if (result.ok) {
          sender.sendEvent({ type: SERVER_SENT_EVENTS.JOINED, data: { name: data.name } });
          sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } }, data.roomId);
        } else if (result.error) {
          sender.sendEvent({ type: SERVER_SENT_EVENTS.ERROR, data: { error: result.error } });
        }
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.DISCONNECT,
      handler: () => {
        socket.rooms.forEach((roomId) => {
          delete rooms[roomId].users[socket.id];
          if (Object.keys(rooms[roomId].users).length === 0) {
            delete rooms[roomId];
          } else {
            sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(roomId) } }, roomId);
          }
        });
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.GET_ROOM_UPDATE,
      handler: (data) => {
        sender.sendEvent({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } });
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.SELECT_CARD,
      handler: (data) => {
        rooms[data.roomId].users[socket.id].card = data.card;
        sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.FLIP_CARDS,
      handler: (data) => {
        rooms[data.roomId].flipped = true;
        sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.RESTART,
      handler: (data) => {
        rooms[data.roomId].flipped = false;
        Object.values(rooms[data.roomId].users).forEach((user) => {
          user.card = null;
        });
        sender.toAll({ type: SERVER_SENT_EVENTS.RESTARTED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });
  });

  io.on("disconnect", (socket) => {
    console.log("a user disconnected");
    Object.values(rooms).forEach((room) => {
      delete room.users[socket.id];
    });
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
