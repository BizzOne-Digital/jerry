import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SITE_TESTIMONIALS } from "@/lib/data/site-testimonials";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "Testimonials" };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Reviews"
        heading="Collector Stories"
        subheading="Real feedback from real collectors."
        imageUrl={BRAND_IMAGES.handshake}
      />
      <section className="py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {SITE_TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={t._id} delay={i * 0.06}>
                <blockquote className="arena-glow rounded-sm bg-arena-surface p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-arena-gold/15 font-display text-sm text-arena-gold"
                      aria-hidden
                    >
                      {initials(t.customerName)}
                    </div>
                    <div>
                      <cite className="not-italic font-display text-arena-cream">{t.customerName}</cite>
                      {t.title && <p className="text-xs text-arena-muted">{t.title}</p>}
                      {t.location && <p className="text-xs text-arena-muted">{t.location}</p>}
                      {t.rating && (
                        <p className="text-xs text-arena-gold" aria-label={`${t.rating} out of 5 stars`}>
                          {"★".repeat(t.rating)}
                          {"☆".repeat(5 - t.rating)}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-arena-muted">&ldquo;{t.text}&rdquo;</p>
                </blockquote>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
