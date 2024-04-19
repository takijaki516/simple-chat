"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Library,
  LibrarySquareIcon,
  Paperclip,
  PlusIcon,
  UsersIcon,
} from "lucide-react";

export const DesktopSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen w-56 bg-neutral-200/50 dark:bg-neutral-900/45",
        " py-14 pl-6 space-y-6 dark:text-muted-foreground",
        "transition-all",
        collapsed && "w-24 px-0 items-center"
      )}
    >
      <div
        className={cn(
          "flex items-center space-x-2 text-2xl relative w-full",
          collapsed && "justify-center"
        )}
      >
        {/* TODO: add logo */}
        <Link href={"/"} className=" hover:text-foreground ">
          {collapsed ? (
            <span>Image</span>
          ) : (
            <>
              <span>Image</span>
              <span className="font-bold">LOGO</span>
            </>
          )}
        </Link>

        {!collapsed && (
          <ChevronsLeftIcon
            className="w-8 h-8 cursor-pointer hover:text-foreground rounded-full"
            onClick={() => setCollapsed((prev) => !prev)}
          />
        )}
      </div>

      <div className="flex space-x-4 hover:text-foreground">
        <PlusIcon />
        {!collapsed && <div className="">Create Chat</div>}
      </div>

      <div className="flex space-x-4 hover:text-foreground">
        <LibrarySquareIcon />
        {!collapsed && <div className=" ">Conversations</div>}
      </div>

      <div className="flex space-x-4 hover:text-foreground">
        <UsersIcon />
        {!collapsed && <div className=" ">Active Users</div>}
      </div>

      {collapsed && (
        <ChevronsRightIcon
          className="w-8 h-8 cursor-pointer hover:text-foreground rounded-full"
          onClick={() => setCollapsed((prev) => !prev)}
        />
      )}
    </div>
  );
};
