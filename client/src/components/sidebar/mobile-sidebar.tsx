"use client";

import { cn } from "@/lib/utils";

export const MobileSidebar = () => {
  return (
    <div className={cn("flex")}>
      <div>Create Chat</div>
      <div>Conversation Rooms</div>
      <div>Active Users</div>
    </div>
  );
};
