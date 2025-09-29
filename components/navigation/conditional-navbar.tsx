"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { DashboardNavbar } from "./dashboard-navbar";

export const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Show dashboard navbar for dashboard routes
  if (pathname.startsWith('/dashboard')) {
    return <DashboardNavbar />;
  }
  
  // Show regular navbar for all other routes
  return <Navbar />;
};
