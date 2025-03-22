import { Room } from "@/app/type/room";
import { EVENTS } from "@/lib/events";
import { ClientSender } from "@/lib/sender";
import { socket } from "@/lib/socket";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const sender = new ClientSender(socket);

const useRoom = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState<Room>({
    id: "",
    users: {},
    flipped: false,
  });
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  console.log(socket.id);
  const disconnect = useCallback((e: Event) => {
    e.preventDefault();
    console.log("disconnecting from server");
  }, []);

  const joinWithName = useCallback((name: string) => {
    sender.sendEvent(EVENTS.JOIN, { name });
  }, []);

  const selectCard = useCallback((card: string) => {
    setSelectedCard(card);
    sender.sendEvent(EVENTS.SELECT_CARD, { card });
  }, []);

  const flipCards = useCallback(() => {
    sender.sendEvent(EVENTS.FLIP_CARDS);
  }, []);

  const restart = useCallback(() => {
    sender.sendEvent(EVENTS.RESTART);
    setSelectedCard(null);
  }, []);

  useEffect(() => {
    if (socket.connected) {
      console.log("connected to server");
      sender.sendEvent(EVENTS.GET_ROOM_UPDATE);
    }

    sender.on(EVENTS.CONNECT);

    sender.on(EVENTS.DISCONNECT, () => {
      setName("");
    });

    sender.on(EVENTS.JOINED, (data) => {
      setName(data.name);
    });

    sender.on(EVENTS.ROOM_UPDATED, (room) => {
      setRoom(room);
    });

    sender.on(EVENTS.ERROR, (data) => {
      toast(data.error);
    });

    sender.on(EVENTS.RESTARTED, (room) => {
      setRoom(room);
      setSelectedCard(null);
    });

    window.addEventListener("beforeunload", disconnect);
    return () => {
      window.removeEventListener("beforeunload", disconnect);
    };
  }, [disconnect]);

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
