"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MainContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return <main className={cn("w-full min-w-0 overflow-x-clip", isHome ? undefined : "pt-16 sm:pt-[4.5rem]")}>{children}</main>;
}
