import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BrandImage } from "@/components/ui/BrandImage";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { BRAND_IMAGES } from "@/lib/images";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        heading="Built for the love of the game."
        subheading="Your trusted source for sports collectibles, autographs, memorabilia, and affordable game tickets."
        imageUrl={BRAND_IMAGES.stadium}
      />

      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal>
              <div>
                <p className="mb-3 font-display text-[11px] tracking-[0.28em] text-arena-gold uppercase">
                  Who we are
                </p>
                <h2 className="font-serif-display text-3xl font-medium leading-tight text-arena-cream sm:text-4xl">
                  Collectors at heart. Dealers with integrity.
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-arena-muted">
                  <p>
                    Sodapops Collectibles LLC is built for collectors and sports fans who want a straight
                    answer, a fair price, and clear condition notes on every piece. Whether you are opening
                    your first pack or hunting a centerpiece for the display case, we make the hobby feel
                    welcoming—not intimidating.
                  </p>
                  <p>
                    Buy, sell, and trade collectible cards, authenticated autographs, sports memorabilia,
                    and more. We also help fans experience the action live with affordable tickets to MLB,
                    NFL, and other major sporting events—without the markup shock.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm arena-glow">
                <BrandImage
                  src={BRAND_IMAGES.about1}
                  alt="Sports collectibles and graded cards on display"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-arena-border/60 bg-arena-navy/45 py-20 lg:py-24">
        <Container className="mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <p className="mb-3 font-display text-[11px] tracking-[0.28em] text-arena-gold uppercase">
              What we stand for
            </p>
            <h2 className="font-serif-display text-3xl font-medium text-arena-gold-bright sm:text-4xl">
              Fair dealing. Clear condition. Collector-first service.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-arena-muted">
              We do not promise what we cannot document. Authentication and COA details are shown only when
              they apply to a specific item. Our goal is simple: help you find great pieces at fair prices
              and enjoy the game—collected and live.
            </p>
            <ul className="mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-2">
              {[
                "Transparent pricing and honest descriptions",
                "Condition notes you can trust before you buy",
                "Responsive support for buy, sell, and trade inquiries",
                "Ticket requests that respect your budget",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-arena-cream/90">
                  <span className="mt-1 text-arena-gold" aria-hidden>
                    ✦
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <ScrollReveal className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm arena-glow">
                <BrandImage
                  src={BRAND_IMAGES.about2}
                  alt="Collector reviewing cards and memorabilia"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="order-1 lg:order-2">
              <div>
                <p className="mb-3 font-display text-[11px] tracking-[0.28em] text-arena-gold uppercase">
                  From the first pack to the centerpiece
                </p>
                <h2 className="font-serif-display text-3xl font-medium leading-tight text-arena-cream sm:text-4xl">
                  Buy it. Sell it. Trade it. Live it.
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-arena-muted">
                  <p>
                    Every collection has a story—a childhood pack rip, a trade that sparked a new chase, a
                    signed piece that finally completes the shelf. We meet collectors wherever they are in
                    that journey and help the next move feel confident.
                  </p>
                  <p>
                    Selling or trading? Tell us what you have. We review condition, market demand, and timing
                    with you—no pressure, no vague offers. Buying? Browse the shop or reach out for something
                    specific. Tickets? Request an event and budget—we will work with what is available.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                  <Link href="/shop">
                    <Button size="lg">Shop the Vault</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-arena-border/60 bg-arena-black py-16">
        <Container>
          <ScrollReveal>
            <h2 className="text-center font-display text-xl tracking-wider text-arena-gold uppercase">
              How we work with collectors
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "01", label: "Browse or inquire", detail: "Shop online or tell us what you need." },
                { step: "02", label: "Review details", detail: "Condition, pricing, and availability—clear up front." },
                { step: "03", label: "Complete the deal", detail: "Order, trade, or sell with straightforward next steps." },
                { step: "04", label: "Enjoy the hobby", detail: "Display, collect, or catch the game live." },
              ].map((item) => (
                <div key={item.step} className="arena-glow rounded-sm bg-arena-surface p-5 text-center">
                  <span className="font-display text-2xl text-arena-gold/60">{item.step}</span>
                  <h3 className="mt-2 font-display text-sm tracking-wider text-arena-cream uppercase">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm text-arena-muted">{item.detail}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
