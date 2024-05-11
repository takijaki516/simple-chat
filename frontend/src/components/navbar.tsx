// import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useAuthStore } from "@/store/auth";
import { DarkModeToggler } from "./dark-mode-toggler";
import { UserDropdown } from "./user-dropdown";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { auth } = useAuthStore();

  return (
    <div
      className="fixed top-0 flex w-full items-center border-b border-border
      backdrop-blur-3xl z-30"
    >
      <div className="container h-16 flex items-center justify-between">
        {/* TODO: leave socket.io room */}
        <Link to={"/"}>Home</Link>

        <div className="flex items-center justify-center gap-2 md:gap-4">
          {auth.token ? (
            <UserDropdown
              // TODO: fix css
              content={
                <Button variant={"destructive"} className="flex w-full gap-1">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              }
            />
          ) : (
            <Link to={"/login"}>
              <Button variant={"link"}>LOGIN</Button>
            </Link>
          )}

          <DarkModeToggler />
        </div>
      </div>
    </div>
  );
};
