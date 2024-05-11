import { type IMessage } from "@/pages/chat";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const OtherMessage = ({
  message,
}: {
  message: Omit<IMessage, "userId">;
}) => {
  return (
    <div className="flex items-center py-2 gap-2">
      <Avatar>
        <AvatarFallback>{message.username}</AvatarFallback>
      </Avatar>

      <div className="bg-primary/90 text-primary-foreground py-2 rounded-sm px-2">
        {message.message}
      </div>
    </div>
  );
};
