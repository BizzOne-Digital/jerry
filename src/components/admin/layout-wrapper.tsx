"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "./admin-shell";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  return <AdminShell>{children}</AdminShell>;
}
