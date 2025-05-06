import { Room } from "@/app/type/room";
import { cn } from "@/lib/utils";
import { CARD_STYLES } from "@/app/constants/cards";
import CardHolder from "../CardHolder";
import { CardEnum } from "@/app/type/card";

const MembersTable = ({
  room,
  socketId,
  cardStyle,
  mySelectedCard,
  mostFrequentlyChoosed,
}: {
  room: Room;
  socketId?: string;
  cardStyle: keyof typeof CARD_STYLES;
  mySelectedCard: CardEnum | null;
  mostFrequentlyChoosed: string | undefined;
}) => {
  return (
    <div className="flex flex-row gap-6 justify-center flex-wrap py-4">
      {Object.values(room.users).map((user) => {
        const isSelf = socketId === user.id;
        const isMostFrequent = room.flipped ? mostFrequentlyChoosed === user.card?.value : false;

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
              value={isSelf ? mySelectedCard : user.card?.value}
              nonce={user.card?.nonce}
              isMostFrequent={isMostFrequent}
              flipped={room.flipped || isSelf}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MembersTable;
