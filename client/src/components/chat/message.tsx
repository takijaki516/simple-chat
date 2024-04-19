"use client"

import Image from "next/image";

interface IMessage {
  senderId: string;
  createdAt: string;
  profilePic?: string;
  content: string;
}

export const Message = ({ message }: any) => {
  // TODO:
  const authUser = {
    id: "tempId",
    name: "tempName",
    profilePic: "tempProfilePic",
  };
  const currentConversation = "tempConversation";

  const myMsg = message.senderId === authUser.id;
  const formattedTime = "11:22";
  const profilePic = myMsg ? authUser.profilePic : message.profilePic;

  return (
    <div>
      <div>IMG</div>
      <div>
        <div>{message.content}</div>
        <div>{formattedTime}</div>
      </div>
    </div>
  );
};
