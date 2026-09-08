"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useReducedMotion } from "./useReducedMotion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay,
            ease: "power2.out",
            onComplete: () => observer.disconnect(),
          });
        }
      },
      { threshold: 0.15 }
    );

    gsap.set(el, { opacity: 0, y: 24 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
