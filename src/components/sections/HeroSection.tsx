import Image from "next/image";
import Link from "next/link";
import { BRAND_IMAGES } from "@/lib/images";

interface HeroSectionProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageUrl?: string;
}

export function HeroSection({
  eyebrow = "Cards • Autographs • Memorabilia • Tickets",
  heading = "Collect. Trade. Experience the Game.",
  subheading = "Great pieces. Fair prices. The thrill of the game—collected.",
  cta = { label: "Shop the Vault", href: "/shop" },
  secondaryCta = { label: "Sell or Trade", href: "/contact?inquiry=Trade" },
  imageUrl = BRAND_IMAGES.hero,
}: HeroSectionProps) {
  const headingLines = (() => {
    const parts = heading
      .split(/(?<=\.)\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length >= 3) {
      return [parts.slice(0, 2).join(" "), parts.slice(2).join(" ")];
    }
    if (parts.length === 2) return parts;
    return [heading];
  })();

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src={imageUrl || BRAND_IMAGES.hero}
        alt=""
        fill
        priority
        className="object-cover object-[72%_center] sm:object-right"
        sizes="100vw"
      />
      <div className="absolute inset-0 hero-overlay-left" />
      <div className="absolute inset-0 bg-gradient-to-t from-arena-black/80 via-transparent to-arena-black/30" />

      <p
        className="hero-vertical-tagline absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 font-display text-[10px] text-arena-cream/55 md:left-5 lg:block xl:left-8"
        aria-hidden
      >
        BUY IT. SELL IT. TRADE IT. LIVE IT.
      </p>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] items-center px-4 pb-16 pt-20 sm:px-6 sm:pt-[5.5rem] lg:px-10 lg:pl-16 xl:pl-20">
        <div className="w-full min-w-0 max-w-2xl">
          <p className="mb-5 font-display text-[10px] tracking-[0.28em] text-arena-gold uppercase sm:text-[11px]">
            {eyebrow}
          </p>

          <h1 className="font-serif-display text-[1.85rem] font-medium leading-[1.1] tracking-[0.03em] text-arena-gold-bright sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            {headingLines.map((line, i) => (
              <span key={line} className="block">
                {line}
                {i < headingLines.length - 1 ? "" : null}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-arena-cream/80 sm:text-lg">{subheading}</p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href={cta.href}
              className="hero-gold-btn inline-flex w-full items-center justify-center rounded-sm px-6 py-3.5 font-display text-xs tracking-[0.18em] uppercase transition-all sm:w-auto sm:min-w-[180px] sm:px-8 sm:tracking-[0.22em]"
            >
              {cta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex w-full items-center justify-center rounded-sm border border-arena-gold/75 bg-transparent px-6 py-3.5 font-display text-xs tracking-[0.18em] text-arena-gold uppercase transition-colors hover:bg-arena-gold/10 sm:w-auto sm:min-w-[180px] sm:px-8 sm:tracking-[0.22em]"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
