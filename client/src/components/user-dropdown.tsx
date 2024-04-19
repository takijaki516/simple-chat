"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerTrigger,
} from "./ui/drawer";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const UserDropdown = ({ content }: { content: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </DrawerTrigger>
        <DrawerOverlay className="bg-opacity-50 backdrop-blur-md" />
        <DrawerContent>{content}</DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{content}</DropdownMenuContent>
    </DropdownMenu>
  );
};
