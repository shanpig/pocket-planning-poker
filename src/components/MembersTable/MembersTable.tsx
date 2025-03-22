import { Room } from "@/app/type/room";
import Card from "../Card";
import { cn } from "@/lib/utils";

const MembersTable = ({
  room,
  socketId,
  selectedCard,
}: {
  room: Room;
  socketId?: string;
  selectedCard: string | null;
}) => {
  return (
    <div className="flex gap-2">
      {Object.values(room.users).map((user) => {
        const isSelf = socketId === user.id;

        return (
          <div key={user.id} className={cn({ "order-first": isSelf })}>
            <div>{isSelf ? "You" : user.name}</div>
            <Card value={isSelf ? selectedCard : user.card} flipped={room.flipped || isSelf}></Card>
          </div>
        );
      })}
    </div>
  );
};

export default MembersTable;
