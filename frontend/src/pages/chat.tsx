import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSocketStore } from "@/store/socket";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface IMessage {
  message: string;
  userId: string;
}

export const Chat = () => {
  const { socket } = useSocketStore();

  const params = useParams();
  const navigate = useNavigate();
  const [myMsg, setMyMsg] = useState("");
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  const convId = params.id;

  useEffect(() => {
    // join room
    if (!socket) {
      navigate("/");
      return;
    }

    console.log("소켓 초기화");
    socket.emit("join_room", { roomId: convId });
    socket.on("broadcast_message", (data: any) => {
      console.log("🚀 ~ file: chat.tsx:33 ~ socket.on ~ data:", data);

      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("broadcast_message");
    };
  }, [socket]);

  const sendMessage = () => {
    if (socket) {
      socket.emit("user_message", { roomId: convId, message: myMsg });
      console.log("okokok!!");
      setMyMsg("");
    }
  };

  return (
    <div className="border border-border flex flex-col container min-h-52 justify-between pb-2">
      <div className="flex flex-col">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <Label>{msg.userId}</Label>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex">
        <Input
          value={myMsg}
          onChange={(e) => setMyMsg(e.target.value)}
          placeholder="enter message"
        />
        <Button size={"icon"} variant={"ghost"} onClick={sendMessage}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
