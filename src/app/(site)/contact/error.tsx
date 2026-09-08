"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/sections/ContactForm";
import { DEFAULT_SITE_SETTINGS } from "@/lib/data/defaults";

export default function ContactError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { contact } = DEFAULT_SITE_SETTINGS;

  return (
    <section className="py-24">
      <Container className="max-w-3xl">
        <div className="text-center">
          <h1 className="font-display text-2xl text-arena-cream sm:text-3xl">Contact page unavailable</h1>
          <p className="mt-4 text-sm text-arena-muted sm:text-base">
            The form didn&apos;t load fully. You can still reach us directly or try again.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <Link href="/">
              <Button variant="outline">Go home</Button>
            </Link>
          </div>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <div className="arena-glow rounded-sm bg-arena-surface p-6">
            <h2 className="font-display text-lg text-arena-gold">Contact Info</h2>
            <p className="mt-4 text-sm text-arena-muted">
              <a href={`mailto:${contact.email}`} className="hover:text-arena-cream">
                {contact.email}
              </a>
            </p>
            <p className="mt-2 text-sm text-arena-muted">
              <a href={contact.phoneLink} className="hover:text-arena-cream">
                {contact.phone}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
