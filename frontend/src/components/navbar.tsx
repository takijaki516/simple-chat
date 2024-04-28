// import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useJwtStore } from "@/store/jwt";
import { DarkModeToggler } from "./dark-mode-toggler";
import { UserDropdown } from "./user-dropdown";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { token } = useJwtStore();

  return (
    <div
      className="fixed top-0 flex w-full items-center border-b border-border
      backdrop-blur-3xl z-30"
    >
      <div className="container h-16 flex items-center justify-between">
        <Link to={"/"}>Home</Link>

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
