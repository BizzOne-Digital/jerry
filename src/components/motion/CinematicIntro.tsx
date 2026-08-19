"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "./useReducedMotion";

const INTRO_KEY = "sodapops-intro-seen";

interface CinematicIntroProps {
  enabled?: boolean;
  oncePerSession?: boolean;
}

function hasSeenIntro(oncePerSession: boolean) {
  if (typeof window === "undefined") return true;
  return oncePerSession ? Boolean(sessionStorage.getItem(INTRO_KEY)) : false;
}

export function CinematicIntro({ enabled = true, oncePerSession = true }: CinematicIntroProps) {
  const reduced = useReducedMotion();
  const shouldPlay = enabled && !hasSeenIntro(oncePerSession);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!shouldPlay || reduced) return;
    const timer = window.setTimeout(() => setVisible(true), 0);
    return () => window.clearTimeout(timer);
  }, [shouldPlay, reduced]);

  useEffect(() => {
    if (!shouldPlay || !reduced) return;
    const timer = window.setTimeout(finish, 250);
    return () => window.clearTimeout(timer);
  }, [shouldPlay, reduced, finish]);

  useEffect(() => {
    if (!visible || !overlayRef.current || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });

      tl.set(".intro-scan", { scaleX: 0, opacity: 1 })
        .to(".intro-scan", { scaleX: 1, duration: 0.35, ease: "power2.inOut" })
        .to(".intro-bloom", { opacity: 0.45, duration: 0.5 }, "-=0.1")
        .from(".intro-card", { rotateY: -28, rotateX: 12, opacity: 0, duration: 0.7 }, "-=0.2")
        .to(".intro-foil", { xPercent: 120, duration: 0.8, ease: "power2.inOut" }, "-=0.5")
        .from(".intro-word-collect", { x: -80, opacity: 0, duration: 0.35 }, "-=0.35")
        .from(".intro-word-trade", { y: 60, opacity: 0, duration: 0.35 }, "-=0.15")
        .from(".intro-word-experience", { x: 80, opacity: 0, duration: 0.35 }, "-=0.15")
        .to(".intro-word", { opacity: 0, duration: 0.2, stagger: 0.04 })
        .from(".intro-wordmark", { scale: 0.88, opacity: 0, duration: 0.45 })
        .from(".intro-tagline", { y: 16, opacity: 0, duration: 0.35 }, "-=0.2")
        .to(".intro-panel-left", { xPercent: -100, duration: 0.55, ease: "power4.inOut" }, "+=0.15")
        .to(".intro-panel-right", { xPercent: 100, duration: 0.55, ease: "power4.inOut" }, "<")
        .to(overlayRef.current, { opacity: 0, duration: 0.35 }, "-=0.15");
    }, overlayRef);

    return () => ctx.revert();
  }, [visible, reduced, finish]);

  if (shouldPlay && reduced) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-arena-black">
        <Logo variant="full" />
      </div>
    );
  }

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] overflow-hidden bg-arena-black"
      role="dialog"
      aria-label="Welcome intro"
      aria-modal="true"
    >
      <div className="intro-bloom pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(215,168,75,0.35),transparent_55%)] opacity-0" />
      <div className="intro-scan absolute top-1/2 left-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-arena-gold to-transparent opacity-0" />

      <div className="absolute inset-0 flex flex-col items-center justify-center perspective-[1200px]">
        <div className="intro-card relative h-40 w-28 rotate-y-12 rounded-md border border-arena-gold/40 bg-arena-navy shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="intro-foil absolute inset-0 bg-gradient-to-br from-arena-blue/30 via-arena-gold/20 to-arena-red/20 opacity-80" />
          <div className="absolute inset-2 rounded border border-arena-cream/10" />
        </div>

        <div className="pointer-events-none mt-8 flex w-full max-w-full flex-col items-center gap-2 px-4 font-display text-xl tracking-[0.2em] text-arena-cream sm:mt-10 sm:text-2xl sm:tracking-[0.35em] md:text-3xl">
          <span className="intro-word intro-word-collect">COLLECT</span>
          <span className="intro-word intro-word-trade">TRADE</span>
          <span className="intro-word intro-word-experience">EXPERIENCE</span>
        </div>

        <div className="intro-wordmark absolute flex flex-col items-center opacity-0">
          <Logo variant="full" className="scale-125" />
          <p className="mt-3 text-xs tracking-[0.4em] text-arena-gold uppercase">The game lives here.</p>
        </div>
      </div>

      <div className="intro-panel-left absolute inset-y-0 left-0 w-1/2 bg-arena-navy border-r border-arena-gold/20" />
      <div className="intro-panel-right absolute inset-y-0 right-0 w-1/2 bg-arena-navy border-l border-arena-gold/20" />

      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-8 right-8 z-10 text-arena-muted"
        onClick={finish}
      >
        Skip intro
      </Button>
    </div>
  );
}
