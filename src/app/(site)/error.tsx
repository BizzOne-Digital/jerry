"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[60vh] items-center py-24">
      <Container className="max-w-xl text-center">
        <h1 className="font-display text-2xl text-arena-cream sm:text-3xl">Something went wrong</h1>
        <p className="mt-4 text-sm text-arena-muted sm:text-base">
          This page couldn&apos;t load completely. Please try again or return home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link href="/">
            <Button variant="outline">Go home</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
