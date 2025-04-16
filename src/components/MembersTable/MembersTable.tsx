import { Room } from "@/app/type/room";
import { cn } from "@/lib/utils";
import { CARD_STYLES } from "@/app/constants/cards";
import CardHolder from "../CardHolder";

const MembersTable = ({
  room,
  socketId,
  cardStyle,
}: {
  room: Room;
  socketId?: string;
  cardStyle: keyof typeof CARD_STYLES;
}) => {
  return (
    <div className="flex flex-row gap-6 justify-center flex-wrap">
      {Object.values(room.users).map((user) => {
        const isSelf = socketId === user.id;

        return (
          <div
            key={user.id}
            className={cn("flex flex-col gap-2 w-16 sm:w-24 md:w-30 items-center md:max-w-32", {
              "order-first": isSelf,
            })}
          >
            <div className="w-full overflow-hidden whitespace-nowrap text-xl text-ellipsis text-center">
              {isSelf ? "You" : user.name}
            </div>
            <CardHolder
              cardStyle={cardStyle}
              value={user.card?.value}
              nonce={user.card?.nonce}
              flipped={room.flipped || isSelf}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MembersTable;
