"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "@/types";
import { AuthModal } from "./auth-modal";
import { DarkModeToggler } from "./dark-mode-toggler";
import { useScroll } from "@/lib/hooks/use-scroll";
import { UserDropdown } from "./user-dropdown";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

interface MainNavProps {
  session: boolean;
}

export const MainNav = ({ session }: MainNavProps) => {
  const scrolled = useScroll(50);

  return (
    <div
      className={cn(
        "sticky top-0 flex w-full justify-center border-b border-gray-200 dark:border-muted",
        scrolled ? "bg-background/50 backdrop-blur-xl" : "bg-background/0",
        "z-30 transition-all"
      )}
    >
      <div
        className="mx-5 flex h-16 max-w-screen-xl items-center justify-between
      w-full"
      >
        <div>CURRENT CHAT: </div>

        <div className="flex items-center justify-center gap-5">
          {session ? (
            <UserDropdown
              content={
                <div className="w-full rounded-md p-2 sm:w-56">
                  <div className="p-2">user data</div>
                  <Button>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          ) : (
            <AuthModal />
          )}

          <DarkModeToggler />
        </div>
      </div>
    </div>
  );
};
