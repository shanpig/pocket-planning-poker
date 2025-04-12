import { Room } from "@/app/type/room";
import Card from "../Card";
import { cn } from "@/lib/utils";
import { CARD_STYLES } from "@/app/constants/cards";
import { CardEnum } from "@/app/type/card";

const MembersTable = ({
  room,
  socketId,
  cardStyle,
  selectedCard,
}: {
  room: Room;
  socketId?: string;
  cardStyle: keyof typeof CARD_STYLES;
  selectedCard: CardEnum | null;
}) => {
  //  w-16 h-24 shrink-0 sm:w-24 sm:h-36 md:w-30 md:h-45
  return (
    <div className="flex flex-row gap-6 justify-center flex-wrap">
      {Object.values(room.users).map((user) => {
        const isSelf = socketId === user.id;

        return (
          <div
            key={user.id}
            className={cn("flex flex-col gap-2 w-16 sm:w-24 md:w-30 items-center overflow-hidden md:max-w-32", {
              "order-first": isSelf,
            })}
          >
            <div className="w-full overflow-hidden whitespace-nowrap text-xl text-ellipsis text-center">
              {isSelf ? "You" : user.name}
            </div>
            <Card
              cardStyle={cardStyle}
              value={isSelf ? selectedCard : user.card}
              flipped={room.flipped || isSelf}
            ></Card>
          </div>
        );
      })}
    </div>
  );
};

export default MembersTable;
