import { Send, ArrowUpRight, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { useSocketStore } from "@/store/socket";
import { MyMessage } from "@/components/my-message";
import { OtherMessage } from "@/components/other-message";

export interface IMessage {
  userId: string;
  message: string;
  username: string;
}

interface IConvInfo {
  title: string;
  ownerId: string;
  id: string;
  createdAt: string;
}

export const Chat = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const { socket } = useSocketStore();

  const [convInfo, setConvInfo] = useState<IConvInfo | null>(null);
  const [myMsg, setMyMsg] = useState("");
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  const convId = params.id;

  useEffect(() => {
    if (convId) {
      const fetchConvInfo = async () => {
        const res = await fetch(`http://localhost:3008/conv/${convId}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        });

        const { data } = await res.json();

        setConvInfo({
          title: data.title,
          createdAt: data.createdAt,
          ownerId: data.ownerId,
          id: data.id,
        });
      };

      fetchConvInfo();
    }
  }, [convId]);

  useEffect(() => {
    // join room
    if (!socket) {
      navigate("/");
      return;
    }

    socket.emit("join_conv", { convId: convId }, (msg: string) => {
      if (msg === "success") {
        console.log("joined conv");
      } else {
        console.log("error joining conv");
        navigate("/"); // go to not found page
      }
    });

    socket.on("broadcast_message", (data: IMessage) => {
      console.log("🚀 ~ file: chat.tsx:33 ~ socket.on ~ data:", data);

      setMessages((prev) => [...prev, data]);
    });

    // TODO:
    socket.on("deleted_conv", (data) => {
      toast.error(`conv ${data} deleted`);
      navigate("/");
    });

    socket.on("left_conv", (data) => {
      toast.error(`conv ${data} left`);
    });

    return () => {
      socket.off("broadcast_message");
      socket.off("deleted_conv");
      socket.off("left_conv");
    };
  }, [socket]);

  // REVIEW:
  const sendMessage = () => {
    if (socket && auth.username) {
      console.log("🚀 ~ file: chat.tsx:104 ~ sendMessage ~ socket:", socket);
      socket.emit("message", {
        convId,
        message: myMsg,
        username: auth.username,
      });
      setMyMsg("");
    }
  };

  const leaveConv = () => {
    if (socket) {
      socket.emit("leave_conv", { convId }, (data: any) => {
        if (data.status === "success") {
          toast.error(`left conv`);
          navigate("/");
        }
      });
    }
  };

  const deleteConv = () => {
    if (socket) {
      socket.emit("delete_conv", { convId }, (data: any) => {
        if (data.status === "success") {
          toast.error(`deleted conv`);
          navigate("/");
        }
      });
    }
  };

  if (!convInfo) {
    return <div>Loading.....</div>;
  }

  return (
    <div className="flex flex-col container pb-2">
      <div className="flex justify-between w-full pb-10">
        <h1 className="text-2xl">{convInfo.title}</h1>

        <div className="text-red-600">
          {convInfo.ownerId === auth.userId ? (
            <Button variant={"ghost"} onClick={deleteConv}>
              <Trash2 className="w-6 h-6" />
            </Button>
          ) : (
            <Button variant={"ghost"} onClick={leaveConv}>
              LEAVE
              <ArrowUpRight className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>

      <div
        className="flex flex-col border border-border w-full
       rounded-md min-h-52 justify-between px-4"
      >
        <div className="flex flex-col w-full ">
          {messages.map((msg, idx) => {
            return msg.userId === auth.userId ? (
              <MyMessage key={idx} message={msg} />
            ) : (
              <OtherMessage key={idx} message={msg} />
            );
          })}
        </div>

        <div className="flex gap-2 pb-2">
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
    </div>
  );
};
