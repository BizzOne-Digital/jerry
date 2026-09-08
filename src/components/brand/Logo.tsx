import Image from "next/image";
import Link from "next/link";
import { BRAND_IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
  priority?: boolean;
}

export function Logo({ className, variant = "full", priority = false }: LogoProps) {
  if (variant === "mark") {
    return (
      <Link
        href="/"
        className={cn("group inline-flex items-center", className)}
        aria-label="Sodapops Collectibles home"
      >
        <Image
          src={BRAND_IMAGES.logo}
          alt="Sodapops Collectibles"
          width={56}
          height={56}
          className="h-9 w-9 rounded-sm object-cover object-left"
          priority={priority}
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label="Sodapops Collectibles home"
    >
      <Image
        src={BRAND_IMAGES.logo}
        alt="Sodapops Collectibles — Sports Memorabilia"
        width={240}
        height={96}
        className={cn(
          "w-auto object-contain transition-opacity group-hover:opacity-90",
          variant === "wordmark" ? "h-10 max-w-[200px] sm:h-12 sm:max-w-[240px]" : "h-12 max-w-[220px] sm:h-14 sm:max-w-[260px]"
        )}
        priority={priority || variant === "wordmark"}
      />
    </Link>
  );
}
