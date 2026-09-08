"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { SITE_FAQS } from "@/lib/data/site-faqs";

export default function FaqsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-24">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-2xl text-arena-cream sm:text-3xl">FAQs unavailable</h1>
          <p className="mt-4 text-sm text-arena-muted sm:text-base">
            The page didn&apos;t load fully. You can still browse common questions below or try again.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-sm border border-arena-gold/40 px-5 py-2.5 font-display text-sm tracking-wider text-arena-gold transition-colors hover:bg-arena-gold/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="mt-12">
          <Accordion items={SITE_FAQS} />
        </div>
      </Container>
    </section>
  );
}
