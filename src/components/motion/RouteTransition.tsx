"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    try {
      gsap.fromTo(
        el,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    } catch {
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  }, [pathname, reduced]);

  return (
    <div ref={ref} className="flex-1">
      {children}
    </div>
  );
}
