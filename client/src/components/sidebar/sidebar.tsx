"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import type { SidebarNavItem } from "@/types";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileSidebar } from "./mobile-sidebar";

export const Sidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return <MobileSidebar />;
  }

  return <DesktopSidebar />;
};
