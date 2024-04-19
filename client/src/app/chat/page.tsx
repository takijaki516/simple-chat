"use client";

import { useSocket } from "@/components/socket-provider";
import { EventHandler, useEffect, useState } from "react";
import { io } from "socket.io-client";

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
    <div className="flex flex-col items-center">
      <h1>Welcome to Chat</h1>
      <div>
        {messages.length === 0 ? (
          <div>No messages yet</div>
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

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button className="border-2 border-white p-4" onClick={sendMessages}>
        test button
      </button>
    </div>
  );
};

export default ChatPage;
