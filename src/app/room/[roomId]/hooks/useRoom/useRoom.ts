import { CardEnum } from "@/app/type/card";
import { Room } from "@/app/type/room";
import { CLIENT_RECEIVED_EVENTS, CLIENT_SENT_EVENTS } from "@/lib/events";
import { ClientSender } from "@/lib/sender/sender";
import { socket } from "@/lib/socket";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const sender = new ClientSender(socket);

const useRoom = ({ debug }: { debug?: boolean } = {}) => {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();

  const [name, setName] = useState(debug ? "debug" : "");
  const [room, setRoom] = useState<Room>(
    debug
      ? {
          id: "debug",
          users: {
            ["debug-user"]: {
              id: "debug-user",
              name: "debug",
              card: {
                value: CardEnum.XXS,
                nonce: "asdf",
              },
            },
            ["debug-user-2"]: {
              id: "debug-user-2",
              name: "debug-2",
            },
            ["debug-user-3"]: {
              id: "debug-user-3",
              name: "debug-3",
              card: { value: CardEnum.XXS, nonce: "fdsa" },
            },
          },
          flipped: false,
          flippedTimes: 0,
        }
      : {
          id: "",
          users: {},
          flipped: false,
          flippedTimes: 0,
        }
  );
  const [selectedCard, setSelectedCard] = useState<CardEnum | null>(debug ? CardEnum.XXS : null);

  const disconnect = useCallback((e: Event) => {
    e.preventDefault();
    return Promise.resolve(() => {
      console.log("disconnecting from server");
    });
  }, []);

  const joinWithName = useCallback(
    (name: string) => {
      sender.sendEvent({ type: CLIENT_SENT_EVENTS.JOIN, data: { name, roomId } });
    },
    [roomId]
  );

  const selectCard = useCallback(
    (card: CardEnum) => {
      setSelectedCard(card);
      sender.sendEvent({ type: CLIENT_SENT_EVENTS.SELECT_CARD, data: { card, roomId } });
    },
    [roomId]
  );

  const flipCards = useCallback(() => {
    sender.sendEvent({ type: CLIENT_SENT_EVENTS.FLIP_CARDS, data: { roomId } });
  }, [roomId]);

  const restart = useCallback(() => {
    sender.sendEvent({ type: CLIENT_SENT_EVENTS.RESTART, data: { roomId } });
    setSelectedCard(null);
  }, [roomId]);

  useEffect(() => {
    if (debug) return;
    if (socket.connected) {
      console.log("connected to server");
      sender.sendEvent({ type: CLIENT_SENT_EVENTS.CHECK_ROOM, data: { roomId } });
      sender.sendEvent({ type: CLIENT_SENT_EVENTS.GET_ROOM_UPDATE, data: { roomId } });
    }

    sender.on({ type: CLIENT_RECEIVED_EVENTS.CONNECT });

    sender.on({
      type: CLIENT_RECEIVED_EVENTS.DISCONNECT,
      handler: () => {
        setName("");
      },
    });

    sender.on({
      type: CLIENT_RECEIVED_EVENTS.JOINED,
      handler: (data) => {
        setName(data.name);
      },
    });

    sender.on({
      type: CLIENT_RECEIVED_EVENTS.ROOM_UPDATED,
      handler: (data) => {
        setRoom(data.room);
      },
    });

    sender.on({
      type: CLIENT_RECEIVED_EVENTS.ERROR,
      handler: (data) => {
        toast(data.error);
      },
    });

    sender.on({
      type: CLIENT_RECEIVED_EVENTS.RESTARTED,
      handler: (data) => {
        setRoom(data.room);
        setSelectedCard(null);
      },
    });

    sender.on({
      type: CLIENT_RECEIVED_EVENTS.ROOM_EXISTS,
      handler: (data) => {
        if (!data.exists) {
          router.push("/");
        }
      },
    });

    window.addEventListener("beforeunload", disconnect);
    return () => {
      window.removeEventListener("beforeunload", disconnect);
    };
  }, [disconnect, debug, roomId, router]);

  return {
    name,
    room,
    socket: debug ? { id: "debug-user" } : socket,
    selectedCard,
    joinWithName,
    selectCard,
    flipCards,
    restart,
  };
};

export default useRoom;
