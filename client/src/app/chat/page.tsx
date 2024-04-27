"use client";

import { useSocket } from "@/components/socket-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MessageInfo {
  content: string;
  sender: string;
}

const ChatPage = () => {
  const { socket, isConnected } = useSocket();
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<MessageInfo[]>([]);

  let sendMessages;

  if (isConnected) {
    // TODO: type
    socket?.on("message", (data) => {
      console.log(data);
    });

    sendMessages = (event: any) => {
      console.log("clicked");
      console.log(isConnected);
      socket?.emit("newMsg", { msg: "hello" });
    };
  }

  return (
    <main className="h-screen container pt-24 pb-10 flex flex-col items-center justify-between gap-2">
      <div className="overflow-hidden border flex-grow w-full md:px-4 flex flex-col rounded-md">
        {messages.length === 0 ? (
          <div className="text-2xl flex items-center justify-center h-full">
            No messages yet
          </div>
        ) : (
          <div>
            {messages.map((message, idx) => (
              <div key={idx}>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 h-16 border border-border">
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={sendMessages}>send message</Button>
      </div>
    </main>
  );
};

export default ChatPage;
