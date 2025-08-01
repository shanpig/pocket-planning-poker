import { createServer } from "node:http";
import { createHash } from "node:crypto";
import next from "next";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { SERVER_SENT_EVENTS, SERVER_RECEIVED_EVENTS } from "./src/lib/events";
import { Room, Rooms } from "./src/app/type/room";
import { ServerSender } from "./src/lib/sender/sender";
import { CardValue } from "./src/app/type/card";
import logger from "./src/lib/logger";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const app = next({ dev, port, hostname });
const HASH_SEED = "pocket-planning-pocker";
const handler = app.getRequestHandler();

const rooms: Rooms = {};

const getHash = (value: string) => {
  const hash = createHash("sha256");
  hash.update(HASH_SEED);
  hash.update(value);
  return hash.digest("hex");
};

const createRoom = (roomId: string) => {
  rooms[roomId] = {
    id: roomId,
    users: {},
    flipped: false,
    flippedTimes: 0,
  };
};

const createUser = (socketId: string, name: string, roomId: string) => {
  if (Object.values(rooms[roomId]?.users || {}).some((user) => user.name === name)) {
    return {
      ok: false,
      error: "User already exists",
    };
  }

  rooms[roomId].users[socketId] = {
    id: socketId,
    name,
    isThinking: false,
    isConfirmed: false,
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
    Object.entries(rooms[roomId]?.users || {}).map(([id, user]) => {
      return [
        id,
        {
          ...user,
          card: user.card
            ? {
                value: rooms[roomId].flipped ? user.card.value : getHash(user.id + user.card.value),
                nonce: user.card?.nonce,
              }
            : undefined,
        },
      ];
    })
  );
};

const cleanupUser = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  logger.log("server: cleaning up rooms. current room status: ", JSON.stringify(rooms));

  Object.values(rooms).forEach((room) => {
    logger.log(`server: removing user ${socket.id} from room ${room.id}`);
    delete room.users[socket.id];
  });
};

const cleanupRooms = (sender: ServerSender) => {
  Object.values(rooms).forEach((room) => {
    if (Object.keys(room.users).length === 0) {
      logger.log(`server: room ${room.id} is empty, deleting`);
      delete rooms[room.id];
    } else {
      sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(room.id) } }, room.id);
    }
  });
};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    logger.log("a user connected");

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

    // 不知為何 socket.on("disconnect") 不會在關閉頁面、重整頁面等時間點觸發，所以改用 conn.on("close") 來監聽
    // ref: https://socket.io/docs/v4/server-socket-instance/
    socket.conn.on("close", (reason) => {
      logger.log("server: a user disconnected, reason: ", reason);
      cleanupUser(socket);
      cleanupRooms(sender);
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.DISCONNECT,
      handler: () => {
        logger.log("server: a user disconnected");
        cleanupUser(socket);
        cleanupRooms(sender);
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
        const user = rooms[data.roomId].users[socket.id];
        user.isConfirmed = true;
        user.isThinking = false;
        user.card = {
          value: data.card as CardValue,
          nonce: getHash(socket.id + data.card),
        };
        sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.FLIP_CARDS,
      handler: (data) => {
        rooms[data.roomId].flipped = true;
        rooms[data.roomId].flippedTimes = rooms[data.roomId].flippedTimes + 1;
        sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.RESTART,
      handler: (data) => {
        rooms[data.roomId].flipped = false;
        Object.values(rooms[data.roomId].users).forEach((user) => {
          user.card = null;
          user.isThinking = false;
          user.isConfirmed = false;
        });
        sender.toAll({ type: SERVER_SENT_EVENTS.RESTARTED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.CHECK_ROOM,
      handler: (data) => {
        sender.sendEvent({ type: SERVER_SENT_EVENTS.ROOM_EXISTS, data: { exists: !!rooms[data.roomId] } });
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.CREATE_ROOM,
      handler: (data) => {
        createRoom(data.roomId);
        sender.sendEvent({ type: SERVER_SENT_EVENTS.ROOM_CREATED, data: { roomId: data.roomId } });
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.THINKING,
      handler: (data) => {
        rooms[data.roomId].users[socket.id].isThinking = true;
        rooms[data.roomId].users[socket.id].isConfirmed = false;
        sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });

    sender.on({
      type: SERVER_RECEIVED_EVENTS.CONFIRM,
      handler: (data) => {
        rooms[data.roomId].users[socket.id].isConfirmed = true;
        rooms[data.roomId].users[socket.id].isThinking = false;
        sender.toAll({ type: SERVER_SENT_EVENTS.ROOM_UPDATED, data: { room: getRoom(data.roomId) } }, data.roomId);
      },
    });
  });

  io.on("disconnect", (socket) => {
    const sender = new ServerSender(io, socket);
    logger.log("io: a user disconnected");
    cleanupRooms(sender);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      logger.log(`> Ready on http://localhost:${port}`);
    });
});
