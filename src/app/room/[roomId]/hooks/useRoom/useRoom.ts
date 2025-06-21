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
              isThinking: false,
              isConfirmed: false,
              card: {
                value: CardEnum.XXS,
                nonce: "asdf",
              },
            },
            ["debug-user-2"]: {
              id: "debug-user-2",
              name: "debug-2",
              isThinking: true,
              isConfirmed: false,
            },
            ["debug-user-3"]: {
              id: "debug-user-3",
              name: "debug-3",
              isThinking: false,
              isConfirmed: true,
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
  const [isThinking, setIsThinking] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const thinking = useCallback(() => {
    sender.sendEvent({ type: CLIENT_SENT_EVENTS.THINKING, data: { roomId } });
    setIsThinking(true);
    setIsConfirmed(false);
  }, [roomId]);

  const confirm = useCallback(() => {
    sender.sendEvent({ type: CLIENT_SENT_EVENTS.CONFIRM, data: { roomId } });
    setIsConfirmed(true);
    setIsThinking(false);
  }, [roomId]);

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
      setIsThinking(false);
      setIsConfirmed(true);
      confirm();
      sender.sendEvent({ type: CLIENT_SENT_EVENTS.SELECT_CARD, data: { card, roomId } });
    },
    [roomId, confirm]
  );

  const flipCards = useCallback(() => {
    if (Object.values(room.users).some((user) => !user.isConfirmed)) {
      toast.info("Please wait for all users to confirm their cards");
      return;
    }
    sender.sendEvent({ type: CLIENT_SENT_EVENTS.FLIP_CARDS, data: { roomId } });
  }, [room.users, roomId]);

  const restart = useCallback(() => {
    sender.sendEvent({ type: CLIENT_SENT_EVENTS.RESTART, data: { roomId } });
    setSelectedCard(null);
    setIsThinking(false);
    setIsConfirmed(false);
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
        if (socket.id) {
          console.log(data.room.users[socket.id]);
          setIsThinking(data.room.users[socket.id].isThinking);
          setIsConfirmed(data.room.users[socket.id].isConfirmed);
        }
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
    isThinking,
    isConfirmed,
    joinWithName,
    selectCard,
    flipCards,
    restart,
    thinking,
    confirm,
  };
};

export default useRoom;
