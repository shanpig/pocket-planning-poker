import { Room } from "@/app/type/room";
import { CLIENT_RECEIVED_EVENTS, CLIENT_SENT_EVENTS } from "@/lib/events";
import { ClientSender } from "@/lib/sender/sender";
import { socket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const sender = new ClientSender(socket);

const useRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const [name, setName] = useState("");
  const [room, setRoom] = useState<Room>({
    id: "",
    users: {},
    flipped: false,
  });
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const disconnect = useCallback((e: Event) => {
    e.preventDefault();
    console.log("disconnecting from server");
  }, []);

  const joinWithName = useCallback(
    (name: string) => {
      sender.sendEvent({ type: CLIENT_SENT_EVENTS.JOIN, data: { name, roomId } });
    },
    [roomId]
  );

  const selectCard = useCallback(
    (card: string) => {
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
    if (socket.connected) {
      console.log("connected to server");
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

    window.addEventListener("beforeunload", disconnect);
    return () => {
      window.removeEventListener("beforeunload", disconnect);
    };
  }, [disconnect, roomId]);
  console.log(room);
  return {
    name,
    room,
    selectedCard,
    joinWithName,
    selectCard,
    flipCards,
    restart,
  };
};

export default useRoom;
