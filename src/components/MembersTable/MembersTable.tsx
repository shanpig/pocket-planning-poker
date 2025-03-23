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
    <div className="flex flex-row gap-6 justify-start flex-wrap md:gap-4 md:flex-row md:justify-center">
      {Object.values(room.users).map((user) => {
        const isSelf = socketId === user.id;

        return (
          <div
            key={user.id}
            className={cn("flex gap-2 items-center md:gap-0 md:flex-col overflow-hidden md:max-w-32", {
              "order-first": isSelf,
            })}
          >
            <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis md:text-center order-last md:order-first">
              {isSelf ? "You" : user.name}
            </div>
            <Card value={isSelf ? selectedCard : user.card} flipped={room.flipped || isSelf}></Card>
          </div>
        );
      })}
    </div>
  );
};

export default MembersTable;
