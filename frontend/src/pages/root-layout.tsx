import { Outlet } from "react-router-dom";

import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { useCheckAuth } from "@/lib/auth-utils";

export const RootLayout = () => {
  useCheckAuth();

  return (
    <div className="h-screen antialiased  bg-background dark:bg-background">
      <Navbar />
      <div className="pt-24 h-full container">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
};
