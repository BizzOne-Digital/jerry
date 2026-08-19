"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type GsapCallback = (ctx: gsap.Context) => void;

export function useGSAP(callback: GsapCallback, deps: unknown[] = []) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {
      callback(ctxRef.current!);
    });
    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
