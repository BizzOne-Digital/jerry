import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SITE_TESTIMONIALS } from "@/lib/data/site-testimonials";

interface Testimonial {
  _id: string;
  customerName: string;
  title?: string;
  text: string;
  rating?: number;
  isDemo?: boolean;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const dbItems = testimonials.filter((t) => !t.isDemo);
  const items = dbItems.length > 0 ? dbItems : SITE_TESTIMONIALS;

  return (
    <section className="py-20">
      <Container>
        <ScrollReveal>
          <SectionHeading eyebrow="Testimonials" heading="Collector Stories" />
        </ScrollReveal>
        <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((t, i) => (
            <ScrollReveal key={t._id} delay={i * 0.1} className="h-full">
              <blockquote className="flex h-full flex-col arena-glow rounded-sm bg-arena-surface p-6">
                <div className="mb-4 flex shrink-0 items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-arena-gold/15 font-display text-xs text-arena-gold"
                    aria-hidden
                  >
                    {initials(t.customerName)}
                  </div>
                  <div>
                    <cite className="not-italic font-medium text-arena-cream">{t.customerName}</cite>
                    {t.title && <p className="text-xs text-arena-muted">{t.title}</p>}
                  </div>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-arena-muted">&ldquo;{t.text}&rdquo;</p>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/testimonials">
            <Button variant="outline">Read More Stories</Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
