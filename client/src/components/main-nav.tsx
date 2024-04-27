"use client";

import Link from "next/link";

import type { SidebarNavItem } from "@/types";
import { AuthModal } from "./auth-modal";
import { DarkModeToggler } from "./dark-mode-toggler";
import { UserDropdown } from "./user-dropdown";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useJwtStore } from "@/lib/jwt-store";
import { useEffect } from "react";

export const MainNav = () => {
  const { token } = useJwtStore();

  return (
    <div
      className="fixed top-0 flex w-full items-center border-b border-border backdrop-blur-3xl
     z-30"
    >
      <div className="container h-16 flex items-center justify-between">
        <div>welcome </div>

        <div className="flex items-center justify-center gap-2 md:gap-4">
          {token ? (
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
            <Link href="/login">
              <Button variant={"link"}>LOGIN</Button>
            </Link>
          )}

          <DarkModeToggler />
        </div>
      </div>
    </div>
  );
};
