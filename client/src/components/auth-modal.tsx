"use client";

import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

export const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isLogin, setIsLogin] = useState(true);

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>{isLogin ? "log in" : "sign up"}</Button>
        </DrawerTrigger>
        <DrawerOverlay className="bg-opacity-50 backdrop-blur-md" />
        <DrawerContent>{isLogin ? "log in" : "sign up"}</DrawerContent>
        </Drawer>
      );
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{isLogin ? "log in" : "sign up"}</Button>
      </DialogTrigger>
      <DialogOverlay className="bg-opacity-50 backdrop-blur-md" />
      <DialogContent>{isLogin ? "log in" : "sign up"}</DialogContent>
    </Dialog>
  );
};
