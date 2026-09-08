import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
}

export function Logo({ className, variant = "full" }: LogoProps) {
  if (variant === "wordmark") {
    return (
      <Link
        href="/"
        className={cn("group inline-flex items-center", className)}
        aria-label="Sodapops Collectibles home"
      >
        <span className="font-serif-display text-base font-light tracking-[0.2em] text-arena-cream transition-colors group-hover:text-arena-gold sm:text-lg sm:tracking-[0.42em]">
          SODAPOPS
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label="Sodapops Collectibles home"
    >
      <svg
        viewBox="0 0 64 64"
        className="h-10 w-10 shrink-0 drop-shadow-[0_0_18px_rgba(215,168,75,0.35)]"
        aria-hidden
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E6B8" />
            <stop offset="45%" stopColor="#D7A84B" />
            <stop offset="100%" stopColor="#9A6F1F" />
          </linearGradient>
          <linearGradient id="logoFoil" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3478F6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3478F6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E44B3F" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="10" stroke="url(#logoGold)" strokeWidth="2" />
        <rect x="10" y="10" width="44" height="44" rx="6" stroke="#F5F0E6" strokeOpacity="0.15" strokeWidth="1" />
        <path d="M18 42c6-10 22-10 28 0" stroke="#E44B3F" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="28" r="3.5" fill="url(#logoGold)" />
        <circle cx="40" cy="28" r="3.5" fill="url(#logoGold)" />
        <path d="M32 14v8M32 46v6M14 32h8M42 32h8" stroke="url(#logoGold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
        <rect x="12" y="12" width="40" height="8" fill="url(#logoFoil)" opacity="0.35" transform="rotate(-18 32 32)" />
        <path d="M20 18h24" stroke="url(#logoGold)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </svg>
      {variant === "full" && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-xl tracking-[0.18em] text-arena-cream transition-colors group-hover:text-arena-gold md:text-2xl">
            SODAPOPS
          </span>
          <span className="text-[10px] tracking-[0.32em] text-arena-gold/85 uppercase">
            Collectibles LLC
          </span>
        </span>
      )}
    </Link>
  );
}
