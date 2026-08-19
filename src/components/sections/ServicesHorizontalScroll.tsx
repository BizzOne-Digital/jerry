"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useMediaQuery } from "@/components/motion/useMediaQuery";
import { Button } from "@/components/ui/Button";
import { BRAND_IMAGES } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export interface HorizontalService {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  cardImage?: { url: string; alt?: string };
  overview?: string;
  benefits?: string[];
  cta?: { label?: string; href?: string };
}

interface ServicesHorizontalScrollProps {
  services: HorizontalService[];
}

function serviceLabel(title: string, index: number): string {
  const labels = [
    "COLLECTIBLE CARDS",
    "SELLING",
    "TRADING",
    "AUTHENTICATED AUTOGRAPHS",
    "MEMORABILIA",
    "GAME TICKETS",
  ];
  return labels[index] ?? title.toUpperCase();
}

export function ServicesHorizontalScroll({ services }: ServicesHorizontalScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isCompact = useMediaQuery("(max-width: 1023px)");
  const [activeIndex, setActiveIndex] = useState(0);
  const useVerticalLayout = reduced || isCompact;

  useEffect(() => {
    if (useVerticalLayout || !sectionRef.current || !trackRef.current || services.length === 0) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              services.length - 1,
              Math.round(self.progress * (services.length - 1))
            );
            setActiveIndex(idx);
          },
        },
      });

      void tween;
    }, sectionRef);

    return () => ctx.revert();
  }, [useVerticalLayout, services.length]);

  if (!services.length) {
    return (
      <section className="py-24">
        <p className="text-center text-arena-muted">Services coming soon.</p>
      </section>
    );
  }

  if (useVerticalLayout) {
    return (
      <section className="space-y-8 px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="font-display text-[11px] tracking-[0.28em] text-arena-gold uppercase">What we offer</p>
          <h2 className="mt-2 font-display text-3xl text-arena-cream sm:text-4xl">Collector Services</h2>
          <p className="mt-3 max-w-xl text-sm text-arena-muted sm:text-base">
            Buy, sell, trade, authenticate, and experience the game.
          </p>
        </div>
        {services.map((service, index) => (
          <ServiceCard key={service._id} service={service} index={index} staticLayout />
        ))}
      </section>
    );
  }

  const pad = String(activeIndex + 1).padStart(2, "0");
  const total = String(services.length).padStart(2, "0");

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-arena-black">
      <div className="flex h-screen max-w-full flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 flex w-full max-w-[1400px] items-end justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <div>
            <p className="font-display text-[11px] tracking-[0.28em] text-arena-gold uppercase">
              What we offer
            </p>
            <h2 className="mt-2 font-display text-3xl text-arena-cream sm:text-4xl lg:text-5xl">
              Collector Services
            </h2>
            <p className="mt-3 max-w-xl text-sm text-arena-muted sm:text-base">
              Buy, sell, trade, authenticate, and experience the game — scroll to explore each service.
            </p>
          </div>
          <p className="hidden shrink-0 font-display text-3xl text-arena-cream sm:block lg:text-4xl">
            <span className="text-arena-gold">{pad}</span>
            <span className="mx-2 text-arena-muted/50">/</span>
            <span className="text-arena-muted">{total}</span>
          </p>
        </div>

        <div ref={trackRef} className="flex w-max gap-6 px-4 pb-4 sm:px-6 lg:px-10">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>

        <p className="mt-6 text-center font-display text-xl text-arena-cream sm:hidden">
          <span className="text-arena-gold">{pad}</span>
          <span className="mx-2 text-arena-muted/50">/</span>
          <span className="text-arena-muted">{total}</span>
        </p>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  index,
  staticLayout = false,
}: {
  service: HorizontalService;
  index: number;
  staticLayout?: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");
  const bullets = (service.benefits ?? []).slice(0, 4);
  const summary = service.overview ?? service.shortDescription;
  const imageUrl = service.cardImage?.url ?? BRAND_IMAGES.services;

  return (
    <article
      className={
        staticLayout
          ? "mx-auto flex max-w-4xl flex-col overflow-hidden rounded-sm border border-arena-border/50 bg-arena-surface sm:flex-row"
          : "flex w-[min(88vw,1100px)] max-w-full shrink-0 flex-col overflow-hidden rounded-sm border border-arena-border/50 bg-arena-surface sm:w-[min(85vw,1100px)] sm:flex-row lg:w-[min(78vw,1100px)]"
      }
    >
      <div className="relative aspect-[16/11] w-full shrink-0 sm:aspect-auto sm:min-h-[420px] sm:w-1/2">
        <Image
          src={imageUrl}
          alt={service.cardImage?.alt ?? service.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>
      <div className="flex w-full flex-col justify-center p-6 sm:w-1/2 sm:p-8 lg:p-10">
        <span className="font-display text-2xl text-arena-gold">{number}</span>
        <h3 className="mt-3 font-display text-2xl leading-tight text-arena-cream sm:text-3xl">
          {service.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-arena-muted sm:text-base">{summary}</p>
        {bullets.length > 0 && (
          <ul className="mt-6 space-y-2">
            {bullets.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-arena-cream/90">
                <span className="text-arena-gold" aria-hidden>
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <span className="font-display text-[10px] tracking-[0.25em] text-arena-gold uppercase">
            {serviceLabel(service.title, index)}
          </span>
          {service.cta?.href && (
            <Link href={service.cta.href}>
              <Button variant="outline" size="sm">
                {service.cta.label ?? "Learn More"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
