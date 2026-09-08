import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BRAND_IMAGES } from "@/lib/images";

export function TicketCta() {
  return (
    <section className="relative overflow-hidden py-24">
      <Image src={BRAND_IMAGES.tickets} alt="" fill className="object-cover opacity-30" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-arena-black via-arena-black/80 to-transparent" />
      <Container className="relative">
        <ScrollReveal>
          <p className="text-xs font-display tracking-[0.25em] text-arena-gold uppercase">Game Day</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl text-arena-cream">Score Premium Tickets</h2>
          <p className="mt-4 max-w-lg text-arena-muted">
            From courtside to club level — we source authenticated tickets for the biggest events.
          </p>
          <Link href="/contact?inquiry=Tickets" className="mt-8 inline-block">
            <Button size="lg" variant="coral">
              Request Tickets
            </Button>
          </Link>
        </ScrollReveal>
      </Container>
    </section>
  );
}
